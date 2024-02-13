import { useEffect, useState } from "react";
import { Tables } from "../types/supabase";
import { supabase } from "../supabaseClient";
import styles from "./Halls.module.css";

function Halls() {
  const [halls, setHalls] = useState<Tables<"hall">[]>();
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
      <h2>Prostorije</h2>
      <ul className={styles.halls}>
        {halls?.map((hall) => (
          <li
            // className={styles.hall}
            key={hall.id}
            // onClick={() => navigate("/prisutnost/" + hall.id)}
          >
            {hall?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Halls;
