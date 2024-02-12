import { createBrowserRouter } from "react-router-dom";
import Halls from "./routes/Halls";
import LectureAttendance from "./routes/LectureAttendance";
import Lectures from "./routes/Lectures";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Lectures />,
  },
  {
    path: "/prisutnost/:lectureId",
    element: <LectureAttendance />,
  },
  {
    path: "/prostorije",
    element: <Halls />,
  },
]);

export default router;
