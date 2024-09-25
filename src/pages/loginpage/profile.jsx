import React, { useState, useEffect } from 'react';
import './profile.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '../../assets/images/defaultProfile.png';

function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [gender, setGender] = useState('male');
  const [isLocal, setIsLocal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const id = localStorage.getItem('id');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`api/springboot/auth/profile?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        const data = response.data;
        setUsername(data.username || '');
        setDescription(data.description || '');
        setEmail(data.email || '');
        setPhoneNumber(data.phoneNumber || '');
        setBirthday(new Date(data.birthday));
        setGender(data.gender || 'male');
        setIsLocal(data.isLocal);
        setProfilePicture(data.profilePicture || null);
      })
      .catch(error => {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      });
  }, []);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const updatedData = {
      id,
      username,
      email,
      description,
      phoneNumber,
      birthday,
      gender,
      isLocal,
      profilePicture,
    };
    axios
      .post('/api/springboot/auth/profile/update', updatedData)
      .then(response => {
        alert('변경되었습니다.');
      })
      .catch(error => {
        console.error('업데이트 중 오류 발생:', error);

        console.log(profilePicture);
      });
  };
  const goToChangePassword = () => {
    navigate('/passwordchange');
  };

  return (
    <div className="account-settings-container">
      <div className="sidebar">
        <h2>계정 설정</h2>
        <ul>
          <li className="active">프로필 설정</li>
          <li onClick={goToChangePassword}>비밀번호 변경</li>
        </ul>
      </div>

      <div className="profile-main-content">
        <div className="profile-picture-section">
          <div className="profile-picture">
            <img src={profilePicture || defaultProfileImage} alt="Profile" className="profile-image" />
          </div>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageUpload}
            className="upload-button"
            style={{ display: 'none' }}
          />
          <label
            htmlFor="fileInput"
            className="btn btn-lg btn-light"
            style={{ border: '1px solid black', marginLeft: '20px' }}
          >
            사진 업로드
          </label>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">닉네임</label>
            <input
              type="text"
              id="username"
              maxLength="16"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <small>한글 8자, 영문 및 숫자 16자까지 조합할 수 있어요.</small>
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="description">소개</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={e => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">휴대폰 번호</label>
            <input type="text" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="birthday">생년월일</label>
            <DatePicker selected={birthday} onChange={date => setBirthday(date)} dateFormat="yyyy-MM-dd" />
          </div>

          <div className="form-group gender-location">
            <div className="gender w-50">
              <label>성별</label>
              <div className="gender-options">
                <label htmlFor="male" style={{ width: '40px' }}>
                  남성
                </label>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  style={{ width: '10px' }}
                  onChange={e => setGender(e.target.value)}
                />
                <label htmlFor="female" style={{ width: '40px', marginLeft: '30px' }}>
                  여성
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  style={{ width: '10px' }}
                  onChange={e => setGender(e.target.value)}
                />
              </div>
            </div>

            <div className="location w-50">
              <label>지역</label>
              <div className="location-options">
                <label>대전이신가요?</label>
                <label className="switch">
                  <input type="checkbox" checked={isLocal} onChange={() => setIsLocal(!isLocal)} />
                  <span className="slider"></span>
                </label>
                <span>{isLocal ? '예' : '아니요'}</span>
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button">
            변경 완료
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;