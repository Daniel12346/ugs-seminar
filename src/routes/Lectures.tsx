import { useEffect, useState } from "react";
import { Tables } from "../types/supabase";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import styles from "./Lectures.module.css";

function Lectures() {
  type Lecture = Tables<"lecture"> & {
    hall: Pick<Tables<"hall">, "name"> | null;
  };
  const [lectures, setLectures] = useState<Lecture[]>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLectures = async () => {
      const { data, error } = await supabase
        .from("lecture")
        .select("*, hall(name)");
      if (error) {
        console.error(error);
        return;
      }
      setLectures(data);
    };
    fetchLectures();
  }, []);
  return (
    <div className={styles.container}>
      <h2>Predavanja</h2>
      <ul className={styles.lectures}>
        {lectures?.map((lecture) => (
          <li
            className={styles.lecture}
            key={lecture.id}
            onClick={() => navigate("/prisutnost/" + lecture.id)}
          >
            <div className={styles.lectureInfo}>
              <div>
                <span className={styles.lectureName}>{lecture?.name}</span>
                <span className={styles.hallName}>{lecture?.hall?.name}</span>
              </div>

              <div className={styles.lectureDateTime}>
                <span className={styles.lectureDate}>{lecture?.date}</span>
                <div className={styles.lectureDuration}>
                  <span>{lecture?.starts_at}</span>-
                  <span className={styles.lectureTime}>{lecture?.ends_at}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Lectures;
