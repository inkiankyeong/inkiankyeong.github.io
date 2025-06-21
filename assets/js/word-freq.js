//text변화하니까 let. 
let text = "";

//불용어 목록. 의미없는 단어 a 등등 을 빼고싶음
const stopwords = ["the","and","to","in","of","a","for", "with", 
    "on", "this", "that", "it", "which", "an"];

const ctx = document.getElementById('myChart').getContext('2d');

const chart = new Chart(ctx,{
    "type":"bar",
    "data": {},
    "options": {
        "responsive": true
    }
});

//html에서 말한 updateChart필요함. 
function updateChart() {
    text = document.getElementById("textInput").value;
    chart.data = getChartData(text);
    chart.update();
};

function getChartData(text, topn=30) {
    // 단어 배열 만들기. toLowercase: 소문자로. /정규표현식/g-하나가 아니라 매치 가능한 모든 것. 
    const words = text.toLowerCase().match(/[a-z가-힣]+/g) || []; //아무것도 없을 경우에는 []빈 배열

    //카운터 객체 만들기. 
    const frequency = {};

    words.forEach( //모든 단어에 대해
        word => { //변수명 words. frequncy 업데이트. 
            frequency[word] = (frequency[word] || 0) +1;
        }
        // 빈 객체undefined라 ++안됨 
        // // ||0: frequncy[word] 또는 없으면 0을 가져와라
    )  

    //불용어 제거: frequency를 0으로 맞춰줌
    for (stop of stopwords) {
        frequency[stop] = 0;
    }

    // 빈도 내림차순으로 정렬하기
    //sort하고 싶음. 지금은 frequency순서가 그냥 나온 단어 순임. 근데 지금은 객체라서 이걸 배열로 바꿔야 sort 가능. 
    // 처음에는 키:밸류 객체였는데 이제 [단어, freq]라는 배열을 원소로 가지는 큰 배열로 바꿔줌
    // 그리고 sort: 두번째 원소인 freq 기준으로 정렬해야함. 
    const sorted = Object.entries(frequency).sort(([,a],[,b]) => b-a);
    //상위 30개만 저장하기
    const freq_sorted = Object.fromEntries(sorted.slice(0,topn));

    //차트용 데이터 만들기
    const chartData = {
    "labels": Object.keys(freq_sorted),
    "datasets": [
        {
            "label":"Frequency",
            "data": Object.values(freq_sorted)
        }
    ]
    };

    return chartData;
};