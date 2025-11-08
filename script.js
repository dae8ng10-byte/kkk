// --- 1. 프로젝트 데이터 및 변수 설정 (미션 내용 및 로직 반영) ---
const missions = [
    { 
        id: 'seed', 
        name: '창조의 씨앗', 
        location: '설문대여성문화센터', 
        isCollected: false, 
        imagePath: './seed_creation.png',
        description: "설문대할망의 신화적 키워드 3가지 (예: 한라산, 오백장군, 섬)를 찾아 입력하여 '창조의 씨앗'을 획득합니다.",
        introDescription: "첫 번째 탐험의 목표는 '창조의 씨앗'을 찾는 것입니다. 전시 관람 중 설문대 신화와 관련된 신화적 키워드 3가지를 찾아 지혜를 증명해야 합니다.", 
        quiz: "전시 관람 중 설문대 신화와 관련된 '신화적 키워드 3가지'를 입력해주세요.",
        answerType: 'keywords', // 키워드 형식 지정
        answer: null // 자유로운 답을 받음
    },
    { 
        id: 'guard', 
        name: '수호의 조각', 
        location: '제주돌문화공원', 
        isCollected: false, 
        imagePath: './seed_wish.png',
        description: "인증 장소에 대한 두 단계의 힌트를 얻은 후, 그 곳에서 기념사진을 촬영하여 '수호의 조각'을 획득하세요.",
        introDescription: "제주돌문화공원에서 '수호의 조각'을 찾기 위해서는 ①돌문화 공원 산책과 ②소원의 돌탑 쌓기를 하며 포토스팟 장소에 대한 힌트를 얻어야 합니다.",
        quiz: "제주돌문화공원 탐험의 첫 번째 단계인 '돌문화 공원 산책'을 완료하셨나요? 미션 힌트: 백록담처럼 보인다.", // M2-1
        answerType: 'hint-1', // M2-1 힌트 획득 플로우 시작
        hint2: "두 번째 단계인 '소원의 돌탑 쌓기'를 완료하세요. 미션 힌트: 돌박물관 옥상에 있다.", // M2-2
        finalLocation: "하늘연못" // 포토 미션 장소
    },
    { 
        id: 'peace', 
        name: '평화의 바람개비', 
        location: '제주4.3평화공원', 
        isCollected: false, 
        imagePath: './seed_peace.png',
        description: "희생자를 위한 바람개비를 바친 후, 구연동화를 듣고 느낀 감정을 작성하여 '평화의 바람개비'를 획득합니다.",
        introDescription: "마지막 목표는 '평화의 바람개비'입니다. 구연동화를 들은 후, 느낀 감정을 진솔하게 기록하는 것이 미션입니다.",
        quiz: "4.3 구연동화와 희생자를 위한 바람개비 바치기를 완료하셨습니다. 느낀 감정을 자유롭게 작성해주세요.",
        answerType: 'sentiment', // 감상평 형식 지정
        answer: null // 자유로운 답을 받음
    }
];

const dialogues = [
    "사랑하는 나의 아이들아, 드디어 이 할망이 만든 섬에 발을 디뎠구나. 나는 설문대, 이 땅의 모든 산과 오름, 그리고 숨 쉬는 너희의 어머니이니라.",
    "나의 창조의 흔적은 돌이 되었고, 백록담의 물이 되었으며, 너희가 딛고 선 역사 속에 스며들어 있단다. 이제 너희가 이 섬의 역사를 나의 눈으로 보며, 그 지혜를 깨우칠 차례이다.",
    // 최종 수정된 대사: 설문대여성문화센터로 안내
    "이 할망이 보낸 첫 번째 '창조의 씨앗'을 가지고, 제주돌문화공원으로 향해라. 너희의 탐험은 그곳의 돌에서부터 시작될지니." 
];

let dialogueIndex = 0;
let currentMissionIndex = 0;
let cameraStream = null;

// --- 2. DOM 요소 선택 ---
// ... (DOM 요소 선택은 이전과 동일) ...
const introScreen = document.getElementById('intro-screen');
const mainScreen = document.getElementById('main-mission-screen');
const dialogueText = document.getElementById('dialogue-text');
const nextDialogueBtn = document.getElementById('next-dialogue-btn');
const startNextMissionBtn = document.getElementById('start-next-mission-btn');

const modal = document.getElementById('mission-modal');
const step1 = document.getElementById('step-1'); 
const step2 = document.getElementById('step-2'); 
const step3 = document.getElementById('step-3'); 
const step4 = document.getElementById('step-4'); 

const missionTitleInfo = document.getElementById('mission-title-info');
const missionDescInfo = document.getElementById('mission-desc-info'); 
const startQuizBtn = document.getElementById('start-quiz-btn'); 

const quizQuestion = document.getElementById('quiz-question');
const quizAnswerInput = document.getElementById('quiz-answer-input');
const quizFeedback = document.getElementById('quiz-feedback');
const continueAfterQuizBtn = document.getElementById('continue-after-quiz-btn'); // Step 2 버튼

const missionLocationText = document.getElementById('mission-location');
const missionItemImage = document.getElementById('mission-item-image');
const missionDescriptionText = document.getElementById('mission-description'); 
const startAuthBtn = document.getElementById('start-auth-btn'); 

const cameraPreview = document.getElementById('camera-preview');
const cameraCanvas = document.getElementById('camera-canvas');
const takePhotoBtn = document.getElementById('take-photo-btn');
const collectItemBtn = document.getElementById('collect-item-btn');


// --- 3. 인트로 화면 로직 (동일) ---
function showNextDialogue() {
    if (dialogueIndex < dialogues.length) {
        dialogueText.textContent = dialogues[dialogueIndex];
        dialogueIndex++;
    } else {
        introScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        renderMissionStatus();
    }
}
nextDialogueBtn.addEventListener('click', showNextDialogue);
document.addEventListener('DOMContentLoaded', showNextDialogue);


// --- 4. 메인 미션 화면 로직 (동일) ---
function renderMissionStatus() {
    const missionStatusList = document.getElementById('mission-status-list');
    const rewardSection = document.getElementById('reward-section');
    
    missionStatusList.innerHTML = '';
    missions.forEach(mission => {
        const status = mission.isCollected ? '✅ 수집 완료' : '❌ 미수집';
        const itemHtml = `<p><b>${mission.name}</b> (${mission.location}): ${status}</p>`;
        missionStatusList.innerHTML += itemHtml;
    });

    const allCollected = missions.every(m => m.isCollected);
    if (allCollected) {
        rewardSection.style.display = 'block';
        startNextMissionBtn.style.display = 'none';
    } else {
        rewardSection.style.display = 'none';
        startNextMissionBtn.style.display = 'block';
    }
}

// '다음 미수집 미션 시작' 버튼 클릭 -> Step 1 (미션 개요 팝업) 표시
startNextMissionBtn.addEventListener('click', () => {
    const nextMission = missions.find(m => !m.isCollected);
    if (!nextMission) return; 

    currentMissionIndex = missions.findIndex(m => m.id === nextMission.id);
    
    // Step 1: 미션 개요 업데이트
    missionTitleInfo.textContent = `미션: ${nextMission.name}`;
    missionDescInfo.textContent = nextMission.introDescription; 
    
startAuthBtn.textContent = "아이템 획득";
    // 모달 열기 및 Step 1 표시
    modal.style.display = 'flex';
    step1.style.display = 'block'; 
    step2.style.display = 'none';
    step3.style.display = 'none';
    step4.style.display = 'none';
});


// --- 5. 미션 모달 4단계 로직 ---

// Step 1 버튼 클릭 -> Step 2 (활동 창) 전환
startQuizBtn.addEventListener('click', () => {
    const currentMission = missions[currentMissionIndex];

    // M2 (수호의 조각) 미션일 경우, 팝업 멘트 및 버튼 로직 변경
    if (currentMission.answerType === 'hint-1') {
        quizQuestion.textContent = currentMission.quiz;
        continueAfterQuizBtn.textContent = "힌트 획득 완료 (다음 단계)";
        quizAnswerInput.style.display = 'none'; // 입력창 숨김
    } else {
        quizQuestion.textContent = currentMission.quiz;
        continueAfterQuizBtn.textContent = "답변 완료 (다음 단계)";
        quizAnswerInput.style.display = 'block'; // 입력창 보임
    }
    
    quizAnswerInput.value = '';
    quizFeedback.textContent = ''; 
    
    step1.style.display = 'none';
    step2.style.display = 'block'; 
});

// Step 2 버튼 ('답변 완료' 또는 '힌트 획득 완료') 클릭 -> Step 3 전환 (M1, M3) 또는 Step 2 반복 (M2)
continueAfterQuizBtn.addEventListener('click', () => {
    const currentMission = missions[currentMissionIndex];
    const userAnswer = quizAnswerInput.value.trim();

    // 1. M1, M3 (일반 퀴즈/감상평) 처리
    if (currentMission.answerType === 'keywords' || currentMission.answerType === 'sentiment') {
        if (userAnswer === "") {
             quizFeedback.textContent = '답변을 입력해주세요.';
             quizFeedback.style.color = 'red';
             return;
        } 
        quizFeedback.textContent = '답변이 기록되었습니다! 다음 장소로 이동하세요.';
        quizFeedback.style.color = 'green';

        // 1.5초 후 Step 3 (장소/아이템 확인)으로 전환
        setTimeout(() => {
            step2.style.display = 'none';
            step3.style.display = 'block';
            
            // Step 3 내용 업데이트
            missionLocationText.textContent = currentMission.location;
            missionItemImage.src = currentMission.imagePath; 
            missionDescriptionText.textContent = currentMission.description; 
        }, 1500);

    // 2. M2 (힌트 획득 단계) 처리
    } else if (currentMission.answerType === 'hint-1') {
        
        // M2-1 완료 -> M2-2 준비
        quizFeedback.textContent = '🎉 첫 번째 힌트 획득 완료! 두 번째 힌트를 찾아보세요.';
        quizFeedback.style.color = 'green';
        currentMission.answerType = 'hint-2'; // 다음 단계를 위한 상태 변경
        
        setTimeout(() => {
            // Step 2 팝업 내부 내용만 M2-2 힌트로 변경 (Step 3로 넘어가지 않음)
            quizQuestion.textContent = currentMission.hint2;
            continueAfterQuizBtn.textContent = "힌트 획득 완료 (미션 장소 확인)";
            quizFeedback.textContent = '';
        }, 1500);

    } else if (currentMission.answerType === 'hint-2') {
        
        // M2-2 완료 -> Step 3 (포토 미션 장소)로 전환
        quizFeedback.textContent = `🎉 두 번째 힌트 획득 완료! 이제 ${currentMission.finalLocation}으로 가세요.`;
        quizFeedback.style.color = 'green';
        
        setTimeout(() => {
            step2.style.display = 'none';
            step3.style.display = 'block';
            
            // Step 3 내용 업데이트 (포토 미션 장소로 변경)
            missionLocationText.textContent = `${currentMission.finalLocation} (포토 미션 장소)`;
            missionItemImage.src = currentMission.imagePath; 
            missionDescriptionText.textContent = `이제 ${currentMission.finalLocation}에 도착하여 사진을 찍고 미션 완료 버튼을 누르세요.`; 
            startAuthBtn.textContent = "포토 미션 시작"; // 버튼 텍스트 변경
        }, 2000);
    }
});

// Step 3 버튼 ('현장 인증 시작') 클릭 -> Step 4 (카메라 화면) 전환 (동일)
startAuthBtn.addEventListener('click', async () => {
    step3.style.display = 'none';
    step4.style.display = 'block'; 

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        cameraPreview.srcObject = cameraStream;
    } catch (err) {
        console.error("카메라 접근 오류: ", err);
        alert("카메라 접근 권한이 필요합니다. 설정에서 허용해주세요.");
    }
});

// --- 카메라로 사진 찍기 기능 추가 (동일) ---
takePhotoBtn.addEventListener('click', () => {
    if (cameraStream) {
        const context = cameraCanvas.getContext('2d');
        cameraCanvas.width = cameraPreview.videoWidth;
        cameraCanvas.height = cameraPreview.videoHeight;
        context.drawImage(cameraPreview, 0, 0, cameraCanvas.width, cameraCanvas.height);

        const dataURL = cameraCanvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `할망런_기념사진_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("사진이 갤러리에 저장됩니다.");
    } else {
        alert("카메라가 활성화되어 있지 않습니다.");
    }
});

// Step 4 버튼 ('아이템 수집 완료') 클릭 (동일)
collectItemBtn.addEventListener('click', () => {
    missions[currentMissionIndex].isCollected = true;
    
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    
    modal.style.display = 'none';
    renderMissionStatus();
});