import React, { useState, useEffect } from "react";
import classes from "./Answer.module.css";
import { IoMdContact } from "react-icons/io";
import instance from "../../api/axios";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

function Answer() {
  const { questionId } = useParams();
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [question, setQuestion] = useState({ title: "", description: "" });
  const [answers, setAnswers] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsLoading(true);
    const fetchQuestion = async () => {
      try {
        const response = await instance.get(`/questions/${questionId}`, {
          headers: { Authorization: "Bearer " + token },
        });
        setQuestion({
          title: response.data.question.title,
          description: response.data.question.description,
        });
      } catch (error) {
        console.error("Error fetching question:", error);
        setErrorMessage("Failed to load question.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAnswers = async () => {
      try {
        const response = await instance.get(`/answers/${questionId}`, {
          headers: { Authorization: "Bearer " + token },
        });
        setAnswers(response.data || []); // Backend returns answers directly as an array
      } catch (error) {
        console.error("Error fetching answers:", error);
        setErrorMessage("Failed to load answers.");
      }
    };

    fetchQuestion();
    fetchAnswers();
  }, [questionId]);

  const postAnswer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!answer) {
      setErrorMessage("Please provide an answer.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await instance.post(
        `/answers`,
        { question_id: questionId, content: answer }, // Fixed to match backend
        { headers: { Authorization: "Bearer " + token } }
      );
      if (response.status === 201) {
        setSuccessMessage("Answer posted successfully");
        setAnswer("");
        const newResponse = await instance.get(`/answers/${questionId}`, {
          headers: { Authorization: "Bearer " + token },
        });
        setAnswers(newResponse.data || []);
      } else if (response.status === 400) {
        setErrorMessage("Please provide an answer.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      setErrorMessage("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isloading ? (
        <Loader />
      ) : (
        <main>
          <section className={classes.question_section}>
            <h2>Question</h2>
            <h3>{question.title}</h3>
            <p className={classes.link_work}>{question.description}</p>
            <br />
          </section>

          <section className={classes.answer_section}>
            <h2>Answer From The Community</h2>
            <hr />
            {answers.length > 0 ? (
              answers.map((answer, index) => (
                <div className={classes.answer} key={answer.answer_id || index}>
                  <div>
                    <IoMdContact size={80} />
                    <h4 className={classes.username}>{answer.username}</h4>
                  </div>
                  <div className={classes.margin}>
                    <p>{answer.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>
                This question hasn't been answered yet. Share your knowledge to
                help others.
              </p>
            )}
          </section>

          <section className={classes.answer_form}>
            <h2>Answer The Question</h2>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && (
              <p className={classes.success}>{successMessage}</p>
            )}
            <textarea
              placeholder="Your Answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="8"
              required
            />
            <button className={classes.submit_btn} onClick={postAnswer}>
              Post Your Answer
            </button>
          </section>
        </main>
      )}
    </>
  );
}

export default Answer;
