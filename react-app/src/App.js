// npm
import React from "react";
import Select from 'react-select';

// components


// css
import './App.css';
import './components/ActionMore/actionMore.css';

// images
import moreAction from '../src/image/more-action.svg';
import EmptyNoteBook from '../src/image/empty-notebook.svg';
import refetchQuestions from '../src/image/refetch-question.svg';

// dummy data
const surveyData = [
  {
    id: 1,
    text: 'What is your favorite color?',
    options: ['Red', 'Green', 'Blue', 'Yellow'],
  },
  {
    id: 2,
    text: 'Who is your favorite person?',
  }
];

const categoryOptions = [
  { value: 'social-emotional-learning', label: 'Social-emotional learning' },
  { value: 'careers', label: 'Careers' },
  { value: 'college', label: 'College' },
  { value: 'other', label: 'Other' },
];

function App(props) {
  const [questions, setQuestions] = React.useState([]);
  const [selectedCategoryOptions, setSelectedCategoryOptions] = React.useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const popoverRef = React.useRef(null);

  const handleMoreActionButtonClick = (event) => {
    const buttonRect = event.target.getBoundingClientRect();
    setPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX,
    });

    // Open the popover
    setIsPopoverOpen(true);
  }

  const handleOutsideClick = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target) && event.target.className !== 'img action-img') {
      setIsPopoverOpen(false);
    }
  };

  const handleCategoryChange = (selected) => {
    setSelectedCategoryOptions(selected);
  }

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="div">
        <div className="div-2">
          <div className="div-11">
            <div className="div-12">
              <div className="column">
                <div className="div-13">
                  <div className="div-14">
                    <div className="div-15">
                      <div className="div-16">Survey Details</div>
                      <div className="div-17">
                        <div className="div-18">Category</div>
                        <div className="div-19">required</div>
                      </div>
                      <div className="">
                        <Select
                          options={categoryOptions}
                          value={selectedCategoryOptions}
                          onChange={handleCategoryChange}
                          placeholder="Select options..."
                        />
                      </div>
                      <div className="div-17">
                        <div className="div-18">Category</div>
                        <div className="div-19">required</div>
                      </div>
                      <div className="">
                        <Select
                          isMulti
                          options={categoryOptions}
                          value={selectedCategoryOptions}
                          onChange={handleCategoryChange}
                          placeholder="Select options..."
                        />
                      </div>
                      <div className="div-17">
                        <div className="div-18">Category</div>
                        <div className="div-19">required</div>
                      </div>
                      <div className="">
                        <Select
                          isMulti
                          options={categoryOptions}
                          value={selectedCategoryOptions}
                          onChange={handleCategoryChange}
                          placeholder="Select options..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="question-container">
                <div className="question-inner-container">
                    <div className="question-heading-title">New Survey Questionaire</div>
                    {questions.length === 0 ? (
                      <div className="no-question-available">
                        <img
                          loading="lazy"
                          alt="empty-notebook"
                          src={EmptyNoteBook}
                        />
                        <div className="no-question-available-text">
                          Questions will be recommended based on the survey details selected by the teacher.
                        </div>
                      </div>
                    ) : (
                      <React.Fragment>
                        <div className="question-heading-info">
                          Select questions you want to add to the survey
                        </div>
                        {questions.map((question) => {
                          return (
                            <div className="single-question-container">
                                <div className="single-question-inner-container">
                                    <div className="question-box">
                                        <div className="question-answer-inner-container-heading">
                                        <label key={question.id} className="custom-checkbox">
                                          <input
                                            type="checkbox"
                                            // checked={checked}
                                            value={question.id}
                                            // onChange={onChange}
                                            className="custom-checkbox-input"
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                        </div>
                                        <div className="question-title">
                                            {question.text}
                                        </div>
                                    </div>
                                    <div className="single-question-action">
                                      <img loading="lazy" alt="refetch-question" src={refetchQuestions} className="img action-img" />
                                      <img
                                        loading="lazy"
                                        alt="more-action"
                                        src={moreAction}
                                        className="img action-img"
                                        onClick={handleMoreActionButtonClick}
                                      />
                                    </div>
                                </div>
                                <div className="divider" />
                                <div className="question-answer-container">
                                    {question.options && question.options.map((option, index) => (
                                      <div className="question-answer-inner-container">
                                        <label key={index} className="option">
                                          <input
                                            type="checkbox"
                                            value={option}
                                          />
                                          <div className="choice-options">{option}</div>
                                        </label>
                                      </div>
                                    ))}
                                    {!question.options && (
                                      <div className="question-answer-inner-container">
                                        <textarea rows="5" className="textarea" />
                                      </div>
                                    )}
                                </div>
                            </div>
                          )
                        })}
                      </React.Fragment>
                    )}
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      {isPopoverOpen && (
        <div
          className="popover"
          ref={popoverRef}
          style={{ top: `${position.top}px`, left: `${position.left - 70}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div>Edit</div>
          <div>Delete</div>
        </div>
      )}
    </>
  );
}

export default App;
