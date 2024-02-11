import { useEffect, useState } from "react";
import styles from "./HallAttendance.module.css";
import { supabase } from "../supabaseClient";
import { Tables } from "../types/supabase";
import { useParams } from "react-router-dom";

type hallStudent = Tables<"hall_student"> & {
  hall: Pick<Tables<"hall">, "name" | "id"> | null;
  student: Pick<Tables<"student">, "firstname" | "lastname"> | null;
};
function HallAttendance() {
  const [hallAttendance, setHallAttendance] = useState<hallStudent[]>();
  const { hallId } = useParams();
  const [hall, setHall] = useState<Tables<"hall">>();
  const handleUpdateStudentPresence = async ({
    hall_id,
    student_id,
    is_student_present,
  }: hallStudent) => {
    if (!hall_id || !student_id) return;
    const { error } = await supabase
      .from("hall_student")
      .update({ is_student_present: !is_student_present })
      .eq("student_id", student_id)
      .eq("hall_id", hall_id);
    if (error) {
      console.error(error);
      return;
    }
  };
  useEffect(() => {
    const getHall = async () => {
      if (!hallId) return;
      const { data, error } = await supabase
        .from("hall")
        .select("*")
        .eq("id", hallId);
      if (error) {
        console.error(error);
        return;
      }
      console.log(data);
      data && setHall(data[0]);
    };
    const getHallAttendance = async () => {
      if (!hallId) return;
      const { data, error } = await supabase
        .from("hall_student")
        .select("*, student(firstname, lastname), hall(name,id)")
        .eq("hall_id", hallId);
      if (error) {
        console.error(error);
        return;
      }
      data && setHallAttendance(data);
    };
    const subscribeToDatabaseChanges = async () => {
      supabase
        .channel("schema-db-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "hall_student",
            filter: `hall_id=eq.${hallId}`,
          },
          (payload) => {
            const updatedHallStudent = payload?.new as Tables<"hall_student">;

            updatedHallStudent &&
              //has to be a function because of the async nature of the state
              //hallAttendance is not updated inside the channel callback
              setHallAttendance((prev) =>
                prev?.map((hallStudent) => {
                  return hallStudent?.student_id ===
                    updatedHallStudent?.student_id
                    ? {
                        ...hallStudent,
                        is_student_present:
                          updatedHallStudent.is_student_present,
                      }
                    : hallStudent;
                })
              );
          }

          //TODO: on UPDATE and DELETE
        )
        .subscribe();
    };

    const init = async () => {
      await getHallAttendance();
      await getHall();
      await subscribeToDatabaseChanges();
    };
    init();
  }, []);
  return (
    <div className={styles.container}>
      <h2>{hall?.name}</h2>
      <ul>
        {hallAttendance?.map(
          (hallStudent) =>
            hallStudent && (
              <div className={styles.studentInfo}>
                <span>
                  {hallStudent.student?.firstname +
                    " " +
                    hallStudent.student?.lastname}
                </span>
                <input
                  type="checkbox"
                  checked={hallStudent.is_student_present}
                  defaultChecked={hallStudent.is_student_present}
                  onChange={() => handleUpdateStudentPresence(hallStudent)}
                />
              </div>
            )
        )}
      </ul>
    </div>
  );
}

export default HallAttendance;
