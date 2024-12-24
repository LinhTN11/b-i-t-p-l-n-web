const UserRouter = require("./UserRoute");
const ExpenseRoute = require("./ExpenseRoute");
const MonthlyLimitRoute = require("./MonthlyLimitRoute");
const BudgetRoute = require("./BudgetRoute");
const UserDetailsRoute = require("./UserDetailsRoute");

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use('/api/expense', ExpenseRoute);
    app.use('/api/monthlyLimit', MonthlyLimitRoute);
    app.use('/api/budgets', BudgetRoute);
    app.use('/api/user-details', UserDetailsRoute);
};

module.exports = routes;