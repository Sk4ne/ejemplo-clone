"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAdmin = void 0;
const userAdmin = (req, res, next) => {
    // const { role, name }:User = req.user;
    const roleUser = req.user;
    const nameUser = req.user;
    if ((roleUser === null || roleUser === void 0 ? void 0 : roleUser.role) !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nameUser === null || nameUser === void 0 ? void 0 : nameUser.name} You do not have administrator permissions`
        });
    }
    next();
};
exports.userAdmin = userAdmin;
