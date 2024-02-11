import { useEffect, useState } from "react";
import { Database } from "../types/supabase";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import styles from "./Halls.module.css";

function Halls() {
  const [halls, setHalls] =
    useState<Database["public"]["Tables"]["hall"]["Row"][]>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchhalls = async () => {
      const { data, error } = await supabase.from("hall").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setHalls(data);
    };
    fetchhalls();
  }, []);
  return (
    <div className={styles.container}>
      <ul className={styles.halls}>
        {halls?.map((hall) => (
          <li
            className={styles.hall}
            key={hall.id}
            onClick={() => navigate("/prisutnost/" + hall.id)}
          >
            {hall?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Halls;
