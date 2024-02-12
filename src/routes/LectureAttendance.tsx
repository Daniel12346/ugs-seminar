import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Tables } from "../types/supabase";
import styles from "./LectureAttendance.module.css";
import { useParams } from "react-router-dom";

type LectureStudent = Tables<"lecture_student"> & {
  lecture: Pick<Tables<"lecture">, "name" | "id"> | null;
  student: Pick<Tables<"student">, "firstname" | "lastname"> | null;
};
function LectureAttendance() {
  const [lectureAttendance, setLectureAttendance] =
    useState<LectureStudent[]>();
  const { lectureId } = useParams();
  const [lecture, setlecture] = useState<Tables<"lecture">>();
  const handleUpdateStudentPresence = async ({
    lecture_id,
    student_id,
    is_student_present,
  }: LectureStudent) => {
    if (!lecture_id || !student_id) return;
    const { error } = await supabase
      .from("lecture_student")
      .update({ is_student_present: !is_student_present })
      .eq("student_id", student_id)
      .eq("lecture_id", lecture_id);
    if (error) {
      console.error(error);
      return;
    }
  };
  useEffect(() => {
    const getLecture = async () => {
      if (!lectureId) return;
      const { data, error } = await supabase
        .from("lecture")
        .select("*")
        .eq("id", lectureId);
      if (error) {
        console.error(error);
        return;
      }
      data && setlecture(data[0]);
    };
    const getLectureAttendance = async () => {
      if (!lectureId) return;
      const { data, error } = await supabase
        .from("lecture_student")
        .select("*, student(firstname, lastname), lecture(name,id)")
        .eq("lecture_id", lectureId);
      if (error) {
        console.error(error);
        return;
      }
      data && setLectureAttendance(data);
    };
    const subscribeToDatabaseChanges = async () => {
      supabase
        .channel("schema-db-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            // table: "lecture_student",
            // filter: `lecture_id=eq.${lectureId}`,
          },
          (payload) => {
            const updatedLectureStudent =
              payload?.new as Tables<"lecture_student">;
            updatedLectureStudent &&
              //has to be a function because of the async nature of the state
              //lectureAttendance is not updated inside the channel callback
              setLectureAttendance((prev) =>
                prev?.map((lectureStudent) => {
                  return lectureStudent?.student_id ===
                    updatedLectureStudent?.student_id
                    ? {
                        ...lectureStudent,
                        is_student_present:
                          updatedLectureStudent.is_student_present,
                      }
                    : lectureStudent;
                })
              );
          }

          //TODO: on UPDATE and DELETE
        )
        .subscribe();
    };

    const init = async () => {
      await subscribeToDatabaseChanges();
      await getLectureAttendance();
      await getLecture();
    };
    init();
  }, []);
  return (
    <div className={styles.container}>
      <h2>{lecture?.name}</h2>

      <div className={styles.lectureInfo}>
        <div>{/* <span className={styles.hallName}>{hall.name}</span> */}</div>

        <div className={styles.lectureDateTime}>
          <span className={styles.lectureDate}>{lecture?.date}</span>
          <div className={styles.lectureDuration}>
            <span>{lecture?.starts_at}</span>-
            <span className={styles.lectureTime}>{lecture?.ends_at}</span>
          </div>
        </div>
      </div>

      <ul>
        {lectureAttendance?.map(
          (lectureStudent) =>
            lectureStudent && (
              <div className={styles.studentInfo}>
                <span>
                  {lectureStudent.student?.firstname +
                    " " +
                    lectureStudent.student?.lastname}
                </span>
                <input
                  type="checkbox"
                  checked={lectureStudent.is_student_present}
                  onChange={() => handleUpdateStudentPresence(lectureStudent)}
                />
              </div>
            )
        )}
      </ul>
    </div>
  );
}

export default LectureAttendance;
