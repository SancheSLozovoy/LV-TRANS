import { pool } from '../db.js';

// АНАЛИТИКА ПО ГРУЗАМ
export async function getCargoAnalytics() {
    // Распределение заказов по весовым категориям
    const [weightCategories] = await pool.query(`
  SELECT 
    CASE 
      WHEN weight < 1000 THEN 'До 1 тонны' 
      WHEN weight BETWEEN 1000 AND 5000 THEN '1-5 тонн' 
      WHEN weight BETWEEN 5001 AND 10000 THEN '5-10 тонн' 
      WHEN weight BETWEEN 10001 AND 20000 THEN '10-20 тонн' 
      WHEN weight > 20000 THEN 'Свыше 20 тонн' 
    END as weight_category, 
    COUNT(*) as orders_count, 
    AVG(DATEDIFF(date_end, date_start)) as avg_delivery_days, 
    MIN(weight) as min_weight, 
    MAX(weight) as max_weight, 
    AVG(weight) as avg_weight 
  FROM orders 
  GROUP BY weight_category 
  ORDER BY 
    CASE 
      WHEN weight_category = 'До 1 тонны' THEN 1 
      WHEN weight_category = '1-5 тонн' THEN 2 
      WHEN weight_category = '5-10 тонн' THEN 3 
      WHEN weight_category = '10-20 тонн' THEN 4 
      WHEN weight_category = 'Свыше 20 тонн' THEN 5 
    END
`);

    return {
        weightCategories,
    };
}

// ВРЕМЕННАЯ АНАЛИТИКА
export async function getTemporalAnalytics() {
    // Сезонное распределение заказов
    const [seasonalDistribution] = await pool.query(
        `SELECT 
            MONTH(create_at) as month,
            COUNT(*) as orders_count,
            SUM(weight) as total_weight,
            AVG(weight) as avg_weight
        FROM orders
        WHERE create_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY MONTH(create_at)
        ORDER BY MONTH(create_at)`,
    );

    return {
        seasonalDistribution,
    };
}

// СТАТУСНАЯ АНАЛИТИКА
export async function getStatusAnalytics() {
    // Распределение заказов по времени
    const [stuckOrders] = await pool.query(
        `SELECT 
            CASE 
                WHEN DATEDIFF(NOW(), create_at) < 7 THEN 'До 7 дней'
                WHEN DATEDIFF(NOW(), create_at) BETWEEN 7 AND 14 THEN '7-14 дней'
                WHEN DATEDIFF(NOW(), create_at) BETWEEN 15 AND 30 THEN '15-30 дней'
                WHEN DATEDIFF(NOW(), create_at) > 30 THEN 'Более 30 дней'
            END as time_range,
            COUNT(*) as orders_count
        FROM orders
        WHERE status_id IN (1, 2, 3) 
        GROUP BY time_range
        ORDER BY CASE 
            WHEN time_range = 'До 7 дней' THEN 1
            WHEN time_range = '7-14 дней' THEN 2
            WHEN time_range = '15-30 дней' THEN 3
            WHEN time_range = 'Более 30 дней' THEN 4
        END`,
    );

    return {
        stuckOrders,
    };
}

// КЛЮЧЕВЫЕ БИЗНЕС-ПОКАЗАТЕЛИ
export async function getBusinessKPI() {
    // Общее количество перевезенных тонн груза
    const [[{ total_weight }]] = await pool.query(
        `SELECT 
            SUM(weight) as total_weight
        FROM orders
        WHERE status_id = 4`,
    );

    // Средний объем груза в см
    const [[{ avg_volume_cm3 }]] = await pool.query(
        `SELECT 
        AVG(length * width * height) as avg_volume_cm3
    FROM orders
    WHERE status_id = 4`,
    );

    const avg_volume_m3 = avg_volume_cm3 / 1000000;

    // Среднее время доставки
    const [[{ avg_delivery_time }]] = await pool.query(
        `SELECT 
            AVG(DATEDIFF(date_end, date_start)) as avg_delivery_time
        FROM orders
        WHERE date_start IS NOT NULL AND date_end IS NOT NULL AND status_id = 4`,
    );

    // Соотношение габаритных и негабаритных грузов
    const [[ratioData]] = await pool.query(
        `SELECT 
            COUNT(CASE WHEN length <= 2000 AND width <= 255 AND height <= 400 THEN 1 END) as standard_cargo_count,
            COUNT(CASE WHEN length > 2000 OR width > 255 OR height > 400 THEN 1 END) as oversized_cargo_count,
            (COUNT(CASE WHEN length > 2000 OR width > 255 OR height > 400 THEN 1 END) / COUNT(*)) * 100 as oversized_percentage
        FROM orders`,
    );

    // Топ-пользователь по объему грузов
    const [[topUser]] = await pool.query(
        `SELECT 
        u.id,
        u.email, 
        COUNT(o.id) as orders_count,
        SUM(o.weight) as total_weight,
        AVG(o.weight) as avg_weight
    FROM orders o
    JOIN users u ON o.user_id = u.id
    GROUP BY o.user_id, u.id, u.email
    ORDER BY total_weight DESC
    LIMIT 1`,
    );

    return {
        totalWeight: total_weight,
        avgVolume: avg_volume_m3,
        avgDeliveryTime: avg_delivery_time,
        oversizedRatio: {
            standardCargoCount: ratioData.standard_cargo_count,
            oversizedCargoCount: ratioData.oversized_cargo_count,
            oversizedPercentage: ratioData.oversized_percentage,
        },
        topUser,
    };
}

// КОМПЛЕКСНЫЕ МЕТРИКИ
export async function getComplexMetrics() {
    // Перевозки с экстремальными параметрами
    const [extremeParameters] = await pool.query(
        `SELECT * FROM (
            SELECT 
                'Топ по весу' as category,
                id, \`from\`, \`to\`, weight, length, width, height,
                DATEDIFF(date_end, date_start) as delivery_days
            FROM orders
            WHERE date_start IS NOT NULL AND date_end IS NOT NULL
            ORDER BY weight DESC
            LIMIT 1
        ) AS top_weight
        
        UNION ALL
        
        SELECT * FROM (
            SELECT 
                'Топ по длине' as category,
                id, \`from\`, \`to\`, weight, length, width, height,
                DATEDIFF(date_end, date_start) as delivery_days
            FROM orders
            WHERE date_start IS NOT NULL AND date_end IS NOT NULL
            ORDER BY length DESC
            LIMIT 1
        ) AS top_length
        
        UNION ALL
        
        SELECT * FROM (
            SELECT 
                'Топ по ширине' as category,
                id, \`from\`, \`to\`, weight, length, width, height,
                DATEDIFF(date_end, date_start) as delivery_days
            FROM orders
            WHERE date_start IS NOT NULL AND date_end IS NOT NULL
            ORDER BY width DESC
            LIMIT 1
        ) AS top_width
        
        UNION ALL
        
        SELECT * FROM (
            SELECT 
                'Топ по высоте' as category,
                id, \`from\`, \`to\`, weight, length, width, height,
                DATEDIFF(date_end, date_start) as delivery_days
            FROM orders
            WHERE date_start IS NOT NULL AND date_end IS NOT NULL
            ORDER BY height DESC
            LIMIT 1
        ) AS top_height
        
        UNION ALL
        
        SELECT * FROM (
            SELECT 
                'Топ по объему' as category,
                id, \`from\`, \`to\`, weight, length, width, height,
                DATEDIFF(date_end, date_start) as delivery_days
            FROM orders
            WHERE date_start IS NOT NULL AND date_end IS NOT NULL
            ORDER BY (length * width * height) DESC
            LIMIT 1
        ) AS top_volume;
        `,
    );

    return {
        extremeParameters,
    };
}
