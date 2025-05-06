import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res
                .status(401)
                .json({ message: 'Token expired. Please refresh your token.' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
}
