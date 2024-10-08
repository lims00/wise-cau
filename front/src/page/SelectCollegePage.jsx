import styled from "styled-components";
import Title from "../component/ui/Title";
import {useEffect, useState} from "react";
import axios from "axios";
import Loading from "../component/ui/Loading";
import ButtonGroup from "../component/ui/ButtonGroup";
import DefaultButton from "../component/ui/DefaultButton";
import {useNavigate} from "react-router-dom";
import CollegeItem from "../component/select-college/CollegeItem";
import CollegeItemList from "../component/select-college/CollegeItemList";
import VerticalAlignCenterWrapper from "../component/ui/VerticalAlignCenterWrapper";
import DefaultWrapper from "../component/ui/DefaultWrapper";


const MyCollege = styled.div`
  @keyframes vibration {
    from {
      transform: rotate(1deg);
    }
    to {
      transform: rotate(-1deg);
    }
  }

  &.vibration {
    color: red;
    animation: vibration .1s infinite;
  }

`;

function SelectCollegePage() {
    const navigate = useNavigate();
    const [colleges, setColleges] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCollegeId, setSelectedCollegeId] = useState(null);
    const [unselectedQuizStartError, setUnselectedQuizStartError] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:4000/api/colleges').then(response => {
            setColleges(response.data.results);
            setIsLoading(false);
        });
    }, []);

    const onSelectCollegeHandler = (collegeId) => {
        setSelectedCollegeId(collegeId);
        setUnselectedQuizStartError(false);
    }

    const quizStartClickHandler = () => {
        if (selectedCollegeId === null) {
            setUnselectedQuizStartError(true);
            return;
        }
        navigate('/quizs');
    }

    const backClickHandler = () => {
        navigate('/');
    }

    let content = <Loading/>;
    let selectedCollegeName = null;

    if (!isLoading) {

        if (selectedCollegeId !== null) {
            selectedCollegeName = colleges[selectedCollegeId - 1].name;
        }


        content =
            <div>
                <CollegeItemList
                    items={colleges}
                    selectedCollegeId={selectedCollegeId}
                    onSelectCollegeHandler={onSelectCollegeHandler}
                />
                <MyCollege className={unselectedQuizStartError && 'vibration'}>
                    나의 단과대는 : {selectedCollegeId !== null && selectedCollegeName}
                </MyCollege>
            </div>;

    }

    return (
        <VerticalAlignCenterWrapper>
            <DefaultWrapper>
                <Title>나의 단과대</Title>
                {content}
                <ButtonGroup>
                    <DefaultButton title='뒤로 가기' onClick={backClickHandler}></DefaultButton>
                    <DefaultButton title='퀴즈 시작!' onClick={quizStartClickHandler}></DefaultButton>
                </ButtonGroup>
            </DefaultWrapper>
        </VerticalAlignCenterWrapper>
    )
}

export default SelectCollegePage;