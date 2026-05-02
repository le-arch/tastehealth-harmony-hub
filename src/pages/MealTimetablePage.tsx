import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Legacy route — meal timetable now lives inside Meal Planning page.
const MealTimetablePage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/meal-planning', { replace: true }); }, [navigate]);
  return null;
};

export default MealTimetablePage;
