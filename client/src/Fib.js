import React, { memo, useCallback, useEffect, useState } from "react";
import axios from "axios";

let timeoutId = null;

const Fib = props => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");
  const [refreshFlag, setRefreshFlag] = useState({});

  const fetchValues = useCallback(async () => {
    try {
      const values = await axios.get("/api/values/current");
      setValues(values.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchIndexes = useCallback(async () => {
    try {
      const seenIndexes = await axios.get("/api/values/all");
      setSeenIndexes(seenIndexes.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const renderValues = useCallback(() => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }, [values]);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      if (isNaN(index) || parseInt(index) > 40) {
        console.log(`Index is not a valid number larger than 40: ${index}`);
        setIndex("");
        return;
      }

      try {
        await axios.post("/api/values", {
          index
        });
        setIndex("");

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setRefreshFlag({});
        }, 3000);
      } catch (error) {
        console.error(error);
      }
    },
    [index]
  );

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, [fetchIndexes, fetchValues, refreshFlag]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="index-input">Enter your index:</label>
        <input
          id="index-input"
          value={index}
          onChange={event => {
            setIndex(event.target.value);
          }}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {seenIndexes.map(({ number }) => number).join(", ")}

      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  );
};

export default memo(Fib);
