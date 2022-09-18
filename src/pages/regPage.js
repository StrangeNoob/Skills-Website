import React, { useState } from "react";
import "../css/regPage.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { FaAngleDown, FaWineGlass } from "react-icons/fa";
import registerImage from "../Assets/images/registerImage.png";
import window from "../Assets/images/browserWindow.png";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../utils/firebase/firebase.utils";
import { createUserWithAxiosPost } from "../utils/api/api.utils";
import { sendEmailToBackend } from "../utils/api/api.utils";
const Registration = () => {
  const auth = getAuth();
  // const dispatch=useDispatch();

  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [branch, setBranch] = useState([]);
  const [answer, setAnswer] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [regexp, setRegexp] = useState(/^[0-9\b]+$/);
  const [user, setUser] = useState({
    name: "",
    enterEmail: "",
    confirmEmail: "",
    enterPassword: "",
    confirmPassword: "",
    enterRedgNo: "",
    enterWing: "",
    interestedDomain: "",
  });
  const [err, setError] = useState(false);
  const buttonHandler = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const confirmButtonHandler = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };
  const checkPhnNo = (e) => {
    // const onlyDigits = e.target.value.test(!/\D/g);
    // setPhoneNo(onlyDigits)
    // if(onlyDigits>9999999999){
    //     alert("enter Valid phone number")
    // }
    // else{
    //     setPhoneNo(onlyDigits)
    // }
    if (!/\D/g.test(e.target.value) && e.target.value <= 9999999999) {
      setPhoneNo(e.target.value);
    } else {
      alert("Phone number is restricted to 10 digits or Invalid Input");
    }
  };
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const register = (e) => {
    e.preventDefault();
    try {
      const {
        name,
        enterEmail,
        confirmEmail,
        enterPassword,
        confirmPassword,
        enterRedgNo,
        enterWing,
        interestedDomain,
      } = user;
      if (
        name &&
        enterEmail &&
        confirmEmail &&
        enterPassword &&
        confirmPassword &&
        enterRedgNo &&
        phoneNo &&
        branch &&
        enterEmail === confirmEmail &&
        enterPassword === confirmPassword
      ) {
        createUserWithEmailAndPassword(
          auth,
          user.enterEmail,
          user.enterPassword
        )
          .then((response) => {
            const res = response.user;

            auth.currentUser.getIdToken(true).then((idToken) => {
              // console.log(idToken);
              createUserWithAxiosPost({
                user: {
                  email: user.enterEmail,
                  password: user.enterPassword,
                  name: user.name,
                  phoneNumber: phoneNo,
                  registrationNumber: enterRedgNo,
                  zairzaMember: answer == "yes" ? "member" : "notMember",
                  interestedDomain: interestedDomain,
                  branch: branch,
                },
                idToken,
              });
            });
          })
          .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
          });

        console.log(user.enterEmail);

        auth.currentUser.getIdToken(true).then((idToken) => {
          sendEmailToBackend({ sendEmail: user.enterEmail, idToken });
        });

        console.log(enterWing);
        if (answer=='yes' && enterWing=="") {
          alert("Please give the wing details");
          return;
        }
        alert("registration successfull");
        nav("/dashboard");
      } else {
        alert("invalid");
      }
    } catch (err) {
      setError(true);
    }

  };
  console.log(user)
  const branches = [
    "Computer Science & Engineering",
    "Information Technology",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Electronics & Instrumentation Engineering",
    "Biotechnology",
    "Civil Engineering",
    "Textile Engineering",
    "Fashion & Apparel Technology",
    "Architecture",
    "Computer Science & Application",
    "Planning",
    "Mathematics & Humanities",
    "Physics",
    "Chemistry",
  ]
  const ans = [
    {
      name: "Yes",
      value: "yes",
    },
    {
      name: "No",
      value: "no",
    },
  ];
  const wings = [
    {
      name: "Software",
      value: "Software",
    },
    {
      name: "Hardware",
      value: "Hardware",
    },
    {
      name: "Design",
      value: "Design",
    },
  ];
  const domains = [
    "Web Development",
    "App Development",
    "UI/UX",
    "Graphics Designing",
    "Competetive Coding",
    "AI/ML",
    "Game Development",
    "game",
    "Embedded System & IOT",
    "ROS",
    "3D and Motion Graphics",
    "Cybersecurity",
    "Blockchain",
    "Devops",
    "devops",
  ];
  const branchHandler = (e) => {
    setBranch(e.target.branches.value);
  };

  const handleWing=(e)=>{
    console.log(e.target.value)
    if(e.target.value){
      setUser({
        ...user,enterWing:e.target.value
      })
    }
    
  }
  const ansHandle = (e) => {
    e.preventDefault();
    setAnswer(e.target.value);
  };
  
  const handleDomain = (e) => {
    e.preventDefault();
    setUser({ ...user, interestedDomain: e.target.value });
  };

  const handleBranch = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setBranch(e.target.value);
  }
  return (
    <div className="page">
      <div className="regPage">
        <h1>Let's learn</h1>
        <p>Sign up to get all the goodies</p>
        <div className="layer1">
          <p>Name</p>
          <input
            type="name"
            placeholder="Enter your Name"
            className="name"
            name="name"
            value={user.name}
            onChange={changeHandler}
          />
        </div>
        <div className="layer2">
          <p>Phone Number</p>
          <div className="phoneInput">
            <div>
              <input type="name" placeholder="+91" className="phoneCode" />
            </div>
            <div className="pc">
              <input
                type="name"
                placeholder="Phone Number"
                className="phoneNumber"
                onChange={checkPhnNo}
              />
            </div>
          </div>
        </div>
        <div className="layer3">
          <div className="email1">
            <p>Email ID</p>
            <input
              type="email"
              className="enterEmail"
              placeholder="Enter your Email"
              name="enterEmail"
              value={user.enterEmail}
              onChange={changeHandler}
            />
          </div>
          <div className="email2 e2">
            <p>Confirm Email ID</p>
            <input
              type="email"
              className="enterEmail"
              placeholder="Confirm your Email"
              name="confirmEmail"
              value={user.confirmEmail}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="layer4">
          <div className="password">
            <p>Password</p>
            <div className="wrapfield">
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="enterPassword"
                  placeholder="Enter password"
                  name="enterPassword"
                  value={user.enterPassword}
                  onChange={changeHandler}
                />
              </div>
              <div className="shBtn">
                <button className="showbtn" onClick={buttonHandler}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>
          </div>
          <div className="password p2">
            <p>Confirm Password</p>
            <div className="wrapfield">
              <div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="enterPassword"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={changeHandler}
                />
              </div>
              <div className="shBtn">
                <button className="showbtn" onClick={confirmButtonHandler}>
                  {showConfirmPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="layer5">
          <div className="student selectBranch">
            <p>Branch</p>
            <select
              className="branch option"
              name="selectBranch"
              value={user.selectBranch}
              onChange={handleBranch}
            >
              <option disabled selected="selected">
                Select your Branch{" "}
              </option>
              {branches.map((branch) => (
                <option value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          <div className="student r1">
            <p>Regd No.</p>
            <input
              type="text"
              className="regdNo"
              placeholder="Enter your redg no."
              name="enterRedgNo"
              value={user.enterRedgNo}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="layer6">
          <div className="membership selectMember">
            <p>Are you a Zairza Member?</p>
            <select
              className="member option"
              onChange={ansHandle}
              name="selectOption"
              value={user.selectOption}
            >
              <option disabled selected="selected">
                Select your option
              </option>
              {ans.map((a) => (
                <option value={a.value}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="membership w1">
            <p>If yes, in which wing?</p>
            <select className="wing" onChange={handleWing} disabled={answer === "no" ? true : false}>
              <option disabled selected="selected">
                Enter your wing
              </option>
              {wings.map((wing) => (
                <option value={wing.value}>{wing.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="layer7 selectdomain">
          <p>Interested Domain for Skills++ 2022</p>
          <select
            className="domain option"
            name="selectDomain"
            value={user.selectDomain}
            onChange={handleDomain}
          >
            <option disabled selected="selected">
              Select your domain
            </option>
            {domains.map((domain) => (
              <option value={domain}>{domain}</option>
            ))}
          </select>
        </div>
        <div className="layer8">
          <div className="btn1">
            <button className="registerBtn" onClick={register}>
              Register
            </button>
          </div>
          <p>or</p>
          <div className="btn2">
            <button className="google">
              <GoogleIcon />
            </button>
          </div>
          <div className="btn3">
            <button className="git">
              <GitHubIcon />
            </button>
          </div>
        </div>
        <div className="layer9">
          <p>
            Already registered?<span onClick={() => nav("/login")}>Login</span>
          </p>
        </div>
      </div>
      <div className="image">
        <img className="regImage" src={registerImage} alt=""/>
        <img className="window" src={window} alt=""/>
      </div>
    </div>
  );
};

export default Registration;
