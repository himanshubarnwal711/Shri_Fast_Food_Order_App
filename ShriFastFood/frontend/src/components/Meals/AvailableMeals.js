import { useEffect, useState } from "react";

import Card from "../UI/Card";
import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://81pgib20if.execute-api.ap-south-1.amazonaws.com";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${API_URL}/meals`);

        if (!response.ok) {
          throw new Error(
            `Could not fetch meals. Status: ${response.status}`
          );
        }

        const data = await response.json();

        const loadedMeals = data.map((meal) => ({
          id: meal.Id,
          name: meal.name,
          description: meal.description,
          price: Number(meal.price),
        }));

        setMeals(loadedMeals);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setHttpError(error.message || "Could not fetch meals.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.MealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;