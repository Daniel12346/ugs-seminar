import { createBrowserRouter } from "react-router-dom";
import Halls from "./routes/Halls";
import HallAttendance from "./routes/HallAttendance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Halls />,
  },
  {
    path: "/prisutnost/:hallId",
    element: <HallAttendance />,
  },
]);

export default router;
