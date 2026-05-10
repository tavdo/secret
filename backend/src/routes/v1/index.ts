import { Router } from "express";

import { authRouter } from "./auth.routes.js";
import { profileRouter } from "./profile.routes.js";
import { bookingRouter } from "./booking.routes.js";
import { messagingRouter } from "./messaging.routes.js";
import { searchRouter } from "./search.routes.js";
import { notificationRouter } from "./notification.routes.js";
import { reviewRouter } from "./review.routes.js";
import { reportRouter } from "./report.routes.js";
import { categoryRouter } from "./category.routes.js";
import { adminRouter } from "./admin.routes.js";

export const v1Routes = Router();

v1Routes.use("/auth", authRouter);
v1Routes.use("/profiles", profileRouter);
v1Routes.use("/bookings", bookingRouter);
v1Routes.use("/messages", messagingRouter);
v1Routes.use("/reviews", reviewRouter);
v1Routes.use("/notifications", notificationRouter);
v1Routes.use("/reports", reportRouter);
v1Routes.use("/categories", categoryRouter);
v1Routes.use("/search", searchRouter);
v1Routes.use("/admin", adminRouter);
