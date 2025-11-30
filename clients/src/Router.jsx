import React from "react";
import Layout from "./pages/Layout/Layout";
import Landing from "./pages/Landing/Landing";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Question from "./pages/Question/Question";
import Answer from "./pages/Answer/Answer";
import Howitworks from "./pages/Howitworks/Howitworks"
import NotFound from "./pages/NotFound/NotFound";
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Landing />} />
        <Route path="/questions" element={<Question />} />
        <Route path="/home/answers/:questionId" element={<Answer />} />
        <Route path="/how-it-works" element={<Howitworks />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
