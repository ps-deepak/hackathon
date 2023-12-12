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

const url = process.env.REACT_APP_API_URL;

// static data
const categoryOptions = [
  { value: 'social-emotional-learning', label: 'Social-emotional learning' },
  { value: 'careers', label: 'Careers' },
  { value: 'college', label: 'College' },
  { value: 'other', label: 'Other' },
];

const subCategoryOptions = {
  'social-emotional-learning': [
    { value: 'emotional-well-being', label: 'Emotional Well-being' },
    { value: 'relationships-and-social-interactions', label: 'Relationships and Social Interactions' },
    { value: 'academic-stress-and-performance', label: 'Academic Stress and Performance' },
    { value: 'bullying-and-peer-pressure', label: 'Bullying and Peer Pressure' },
    { value: 'home-and-family-life', label: 'Home and Family Life' },
    { value: 'health-and-wellness', label: 'Health and Wellness' },
    { value: 'school-climate-and-safety', label: 'School Climate and Safety' },
  ],
  'exit': [
    { value: 'academic-experience', label: 'Academic Experience' },
    { value: 'career-and-college-readiness', label: 'Career and College Readiness' },
    { value: 'teacher-and-staff-relationships', label: 'Teacher and Staff Relationships' },
    { value: 'school-facilities-and-resources', label: 'School Facilities and Resources' },
    { value: 'school-culture-and-community', label: 'School Culture and Community' },
    { value: 'feedback-on-counseling-services', label: 'Feedback on Counseling Services' },
    { value: 'preparation-for-life-beyond-high-school', label: 'Preparation for Life Beyond High School' },
  ],
  'careers': [
    { value: 'career-interests-and-goals', label: 'Career Interests and Goals' },
    { value: 'skills-and-strengths', label: 'Skills and Strengths' },
    { value: 'educational-and-training-goals', label: 'Educational and Training Goals' },
    { value: 'awareness-of-career-options', label: 'Awareness of Career Options' },
    { value: 'challenges-and-concerns', label: 'Challenges and Concerns' },
    { value: 'extracurricular-and-work-experience', label: 'Extracurricular and Work Experience' },
    { value: 'college-and-career-planning-resources', label: 'College and Career Planning Resources' },
    { value: 'post-graduation-plans', label: 'Post-Graduation Plans' },
  ],
  'college': [
    { value: 'college-preferences', label: 'College Preferences' },
    { value: 'field-of-study-and-major', label: 'Field of Study and Major' },
    { value: 'college-size-and-campus-environment', label: 'College Size and Campus Environment' },
    { value: 'financial-considerations', label: 'Financial Considerations' },
    { value: 'college-admission-process', label: 'College Admission Process' },
    { value: 'standardized-testing', label: 'Standardized Testing' },
    { value: 'college-visits-and-information-sessions', label: 'College Visits and Information Sessions' },
    { value: 'post-graduation-goals', label: 'Post-Graduation Goals' },
    { value: 'support-system', label: 'Support System' },
    { value: 'decision-making-factors', label: 'Decision-Making Factors' },
    { value: 'backup-plans', label: 'Backup Plans' },
  ],
  'other': [
    { value: 'reelection', label: 'Reelection' },
    { value: 'prom-poll', label: 'Prom Poll' },
    { value: 'assessment', label: 'Assessment' },
  ],
};

const gradeOptions = [
  { value: 'grade_3', label: 'Grade 3' },
  { value: 'grade_4', label: 'Grade 4' },
  { value: 'grade_5', label: 'Grade 5' },
  { value: 'grade_6', label: 'Grade 6' },
  { value: 'grade_7', label: 'Grade 7' },
  { value: 'grade_8', label: 'Grade 8' },
  { value: 'grade_9', label: 'Grade 9' },
  { value: 'grade_10', label: 'Grade 10' },
  { value: 'grade_11', label: 'Grade 11' },
  { value: 'grade_12', label: 'Grade 12' },
];

function App(props) {
  const [questions, setQuestions] = React.useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = React.useState(null);
  const [selectedSubCategoryOption, setSelectedSubCategoryOption] = React.useState([]);
  const [selectedGradeOption, setSelectedGradeOption] = React.useState([]);
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

  const handleCategoryChange = (selected, actionMeta) => {
    switch (actionMeta.name) {
      case 'category':
          setSelectedCategoryOption(selected);
        break;
        case 'sub-category':
          setSelectedSubCategoryOption(selected);
        break;
        case 'grade':
          setSelectedGradeOption(selected);
        break;
      default:
        break;
    }
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const category = selectedCategoryOption?.value;
    const subCategory = selectedSubCategoryOption.map((option) => option.value);
    const grade = selectedGradeOption.map((option) => extractNumbers(option.value)).filter(x => x);
    if (category && subCategory && grade) {
      const data = {
        category,
        subCategory,
        grade,
      };
      try {
        const response = await fetch(`${url}/api/get-recomended-survey`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const responseData = await response.json();
        console.log('Response:', responseData);
        return responseData;
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }
    }
  }

  const extractNumbers = (input) => {
    const matches = input.match(/\d+/g);
    return matches ? parseInt(matches[0], 10) : null;
  };

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
                          name="category"
                          options={categoryOptions}
                          value={selectedCategoryOption}
                          onChange={handleCategoryChange}
                          placeholder="Select options..."
                        />
                      </div>
                      <div className="div-17">
                        <div className="div-18">Sub Category</div>
                        <div className="div-19">required</div>
                      </div>
                      <div className="">
                        <Select
                          name="sub-category"
                          isMulti
                          options={subCategoryOptions[selectedCategoryOption?.value] || []}
                          value={selectedSubCategoryOption}
                          onChange={handleCategoryChange}
                          placeholder="Select options..."
                        />
                      </div>
                      <div className="div-17">
                        <div className="div-18">Grades</div>
                        <div className="div-19">required</div>
                      </div>
                      <div className="">
                        <Select
                          isMulti
                          options={gradeOptions}
                          name="grade"
                          value={selectedGradeOption}
                          onChange={handleCategoryChange}
                          placeholder="Select options..."
                        />
                      </div>
                      <div className="div-17">
                        <div className="div-18">
                          <div
                            onClick={handleSubmitForm}
                            className="apply-button"
                          >
                            Apply
                          </div>
                        </div>
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
