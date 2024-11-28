// 制定回饋規則 打分機制

function feedback(){
    //GPT的部分
    function callOpenAI(rightact, useract, rightanswer, useranswer, learnpoint) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "assistant", content: "你是一個專業的護理老師，判斷學生給出的給藥理由與給藥行為是否正確，請根據問題使用繁體中文回覆，回饋會根據學習者給藥行為是否正確，給藥理由是否正確，給學習者回饋建議\n 因此，有四種可能結果\n 1.給藥理由正確，給藥行為正確\n 2.給藥理由錯誤，給藥行為錯誤\n 3.給藥理由正確，給藥行為錯誤\n 4.給藥理由錯誤，給藥行為正確\n 根據這四種可能結果，並加入學習者的理由以及這顆藥的學習重點()內的文字，如果學生的給藥行為和給藥行為皆為正確就算是正確，如果正確就先回覆數字1再繼續產生回應，回應格式如下:1or0，你的給藥理由xx是正確or錯誤的，給藥行為是正確or錯誤的....." },
                    { role: "user", content: "正確的給藥行為為(" + rightact + ")，學生給藥的行為為(" + useract + ")，正確給藥理由答案為(" + rightanswer + ")，學生回答的給藥理由為(" + useranswer + ")，學習重點:(" + learnpoint + ")" }
                ]
            })
        };
      
        return fetch('https://api.openai.com/v1/chat/completions', requestOptions)
          .then(response => response.json())
          .then(data => data.choices[0].message.content)
          .catch(error => {
            console.error('Error:', error);
            return null;
          });
    }

    console.log(syringe_value);
    var wrong_syringe = 0;
    for (const [key, value] of Object.entries(syringe_value)) {
        if (value[0] != 0){
            wrong_syringe = wrong_syringe + 1;
        }
      }

    var score = 0;
    var q_time=0;
    var id_name = 'ID：' + document.getElementById('IDF_ID').value + ' 姓名：' + document.getElementById('IDF_name').value;
    $('.ODF_ID')[0].innerText= id_name;

    // 1
    const radios = document.getElementsByName('barcode');
    var img1 = document.getElementById('1 img');
    
    if (radios[1].checked){
        cognition.push(11);
        score = score + 1;
        img1.src="pic/ok_w.png";
        paitent_r = '您非常細心，有觀察到病人身分錯誤，繼續保持!' ;
        correctness.push(11);
        q_time = q_time + 1;
    }else{
        cognition.push(10);
        img1.src="pic/wrong_w.png";
        paitent_r = '掃描結果：' + $('.ODF_value')[0].innerText + ',   您判斷是否正確： No<br>同名陳志明；<b style="color: #228de5;">但出生年月日錯誤</b>(52/9/17)；正確為(37/6/17)<br><font style="color: #f44336;">★ 給藥之前，要先核對患者身份 。 <font style="background-color: yellow;">身份辨識方式</font>包括，詢問對方的「姓名」與「出生年月日」</font>';
        correctness.push(10);
        q_time = q_time + 1;
    }
    
    document.getElementById('paitent r').innerHTML = paitent_r;


    // 2
    var img2 = document.getElementById('2 img');
    // if (pill_detect['Dilatrend25'] == 0 && pill_detect['Dilantin'] == 0) 
    if (!document.getElementById('check1').checked ){
        c2r = ''
        r2r = ''
        // r2r = '您不給 Dilatrend 25mg/tab 的理由：' + document.getElementById('Dilatrend 25mg/tab r no').value;
        reason.push(document.getElementById('Dilatrend 25mg/tab r no').value);
        cognition.push(21);
        if (pill_detect['Dilatrend'] == 0 && pill_detect['Dilantin'] == 0){
            // score = score + 1;
            // correctness.push(1);
            // c2r = '你很棒，繼續保持!'
            // img2.src="pic/ok_w.png";
            const userAnswer = document.getElementById('Dilatrend 25mg/tab r no').value;
            callOpenAI("不給藥", "不給藥", "藥物錯誤", userAnswer, "核對不僅是藥袋名稱，還要注意藥袋內的藥名，Dilatrend 和 Dilantin乍看前面的英文字很像，因此需要小心辨識! ").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img2.src = "pic/ok_w.png";
                      c2r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(21);
                    } else {
                      img2.src = "pic/wrong_w.png";
                      r2r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(201);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('2 r').innerHTML = c2r;
                document.getElementById('2 r 2').innerHTML = r2r;
                q_time = q_time + 1;
            });
        }else{
            // img2.src="pic/wrong_w.png";
            // r2r = '您不給 Dilatrend 25mg/tab 的理由：' + document.getElementById('Dilatrend 25mg/tab r no').value
            // +'<br>-> 答錯原因：實際給藥錯誤'
            // +'<br>藥袋內<b style="color: #228de5;">藥物錯誤</b> (Dilantin)，<font style="color: #00B050;">正確藥物為 (Dilatrend)</font>'
            // +'<br><font style="color: #f44336;">★ 核對不僅是藥袋名稱，還要注意<font style="background-color: yellow;">藥袋內的藥名</font>，<font style="text-decoration:underline;">Dila</font>trend 和 <font style="text-decoration:underline;">Dila</font>ntin乍看前面的英文字很像，因此需要小心辨識！</font>';
            // correctness.push(0);
            // document.getElementById('2 r 2').innerHTML = r2r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('Dilatrend 25mg/tab r no').value;
            callOpenAI("不給藥", "給藥", "藥物錯誤", userAnswer, "核對不僅是藥袋名稱，還要注意藥袋內的藥名，Dilatrend 和 Dilantin乍看前面的英文字很像，因此需要小心辨識! ").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    img2.src = "pic/wrong_w.png";
                    r2r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(202);
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('2 r').innerHTML = c2r;
                document.getElementById('2 r 2').innerHTML = r2r;
                q_time = q_time + 1;
            });
        }

    }else{
        cognition.push(20);
        img2.src="pic/wrong_w.png";
        r2 = '您給 Dilatrend 25mg/tab 的理由：' + document.getElementById('Dilatrend 25mg/tab r').value
        +'<br>-> 答錯原因：「三讀五對」認知錯誤'
        +'<br>藥袋內<b style="color: #228de5;">藥物錯誤</b> (Dilantin)，<font style="color: #00B050;">正確藥物為 (Dilatrend)</font>'
        +'<br><font style="color: #f44336;">★ 核對不僅是藥袋名稱，還要注意<font style="background-color: yellow;">藥袋內的藥名</font>，<font style="text-decoration:underline;">Dila</font>trend 和 <font style="text-decoration:underline;">Dila</font>ntin乍看前面的英文字很像，因此需要小心辨識！</font>';
        document.getElementById('2 r').innerHTML = r2;
        correctness.push(203);
        reason.push(document.getElementById('Dilatrend 25mg/tab r').value);
        q_time = q_time + 1;
    }

    
    // 3
    var img3 = document.getElementById('3 img');
     
    if (!document.getElementById('check2').checked){
        c3r = ''
        r3r = ''
        // r3r = '您不給 Requip F.C 0.25mg/tab 的理由：' + document.getElementById('Requip F.C 0.25mg/tab r no').value;
        reason.push(document.getElementById('Requip F.C 0.25mg/tab r no').value);
        cognition.push(31);
        if (pill_detect['Requip'] == 0 && pill_detect['Requip1'] == 0){
            // score = score + 1;
            // img3.src="pic/ok_w.png";
            // c3r = '你是最棒的!'
            // correctness.push(1);
            const userAnswer = document.getElementById('Requip F.C 0.25mg/tab r no').value;
            callOpenAI("不給藥", "不給藥", "劑量錯誤", userAnswer, "同一種藥物會有「不同的劑量」，因此需要注意單顆劑量!").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img3.src = "pic/ok_w.png";
                      c3r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(31);
                    } else {
                      img3.src = "pic/wrong_w.png";
                      r3r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(301);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('3 r').innerHTML = c3r;
                document.getElementById('3 r 3').innerHTML = r3r;
                q_time = q_time + 1;
            });
        }else{
            // img3.src="pic/wrong_w.png";
            // r3r = '您不給 Requip F.C 0.25mg/tab 的理由：' + document.getElementById('Requip F.C 0.25mg/tab r no').value
            // +'<br> -> 答錯原因：實際給藥錯誤'
            // +'<br>藥袋內<b style="color: #228de5;">劑量錯誤</b>(1mg)，<font style="color: #00B050;">正確劑量為(0.25mg)</font>'
            // +'<br><font style="color: #f44336;">★ 同一種藥物會有「不同的劑量」，因此需要注意<font style="background-color: yellow;">單顆劑量</font>!</font>';
            // correctness.push(0);
            // document.getElementById('3 r 3').innerHTML = r3r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('Requip F.C 0.25mg/tab r no').value;
            callOpenAI("不給藥", "給藥", "劑量錯誤", userAnswer, "同一種藥物會有「不同的劑量」，因此需要注意單顆劑量!").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    img3.src = "pic/wrong_w.png";
                    r3r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(302);
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('3 r').innerHTML = c3r;
                document.getElementById('3 r 3').innerHTML = r3r;
                q_time = q_time + 1;
            });
        }
        

    }else{
        cognition.push(30);
        img3.src="pic/wrong_w.png";
        r3 = '您給 Requip F.C 0.25mg/tab 的理由：' + document.getElementById('Requip F.C 0.25mg/tab r').value
        +'<br>-> 答錯原因：「三讀五對」認知錯誤'
        +'<br>藥袋內<b style="color: #228de5;">劑量錯誤</b>(1mg)，<font style="color: #00B050;">正確劑量為(0.25mg)</font>'
        +'<br><font style="color: #f44336;">★ 同一種藥物會有「不同的劑量」，因此需要注意<font style="background-color: yellow;">單顆劑量</font>!</font>';
        document.getElementById('3 r').innerHTML = r3;
        correctness.push(303);
        reason.push(document.getElementById('Requip F.C 0.25mg/tab r').value);
        q_time = q_time + 1;
    }


    // 4
    var img4 = document.getElementById('4 img');
    if (!document.getElementById('check3').checked){
        c4r = '';
        r4r = '';
        reason.push(document.getElementById('Millisrol inj 5mg/10ml/amp r no').value);
        cognition.push(41);

        const userAnswer = document.getElementById('Millisrol inj 5mg/10ml/amp r no').value;
        callOpenAI("不給藥", "不給藥","途徑錯誤", userAnswer, "有些心血管藥物和濃度高的藥物不能直接靜脈推注IV push，可能會造成嚴重低血壓或血管壞死等問題。當藥物途徑為靜脈滴注IV drip，我們要特別注意是要用精密輸液套 (IV bag) 還是點滴幫浦儀器 (IV pump)").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                if (apiResponse[0] == "1") {
                    score += 1;
                    img4.src = "pic/ok_w.png";
                    c4r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(41);
                } else {
                    img4.src = "pic/wrong_w.png";
                    r4r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(402);
                }
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
            document.getElementById('4 r').innerHTML = c4r;
            document.getElementById('4 r 4').innerHTML = r4r;
            q_time = q_time + 1;
        });

    }else{
        cognition.push(40);
        img4.src="pic/wrong_w.png";
        r4 = '您給 Millisrol inj 5mg/10ml/amp 的理由：' + document.getElementById('Millisrol inj 5mg/10ml/amp r').value;
        r4 = r4 + ' -> 答錯原因：實際給藥錯誤' + 
        '<br><font style="background-color: yellow;">★ 有些心血管藥物和濃度高的藥物不能直接靜脈推注IV push</font>，可能會造成嚴重低血壓或血管壞死等問題' +
        '<br><font style="background-color: yellow;">★ 當藥物途徑為靜脈滴注IV drip，我們要特別注意是要用<b>精密輸液套 (IV bag)</b> 還是<b>點滴幫浦儀器 (IV pump)</b></font>';
        correctness.push(403);
        document.getElementById('4 r').innerHTML = r4;
        reason.push(document.getElementById('Millisrol inj 5mg/10ml/amp r').value);
        q_time = q_time + 1;
    }   


    // 5
    var img5 = document.getElementById('5 img');
    
    if (!document.getElementById('check4').checked){
        c5r = ''
        r5r = ''
        // r5r = '您不給 Repaglinide 1mg/tab 的理由：' + document.getElementById('Repaglinide 1mg/tab r no').value;
        reason.push(document.getElementById('Repaglinide 1mg/tab r no').value);
        cognition.push(51);
        if (pill_detect['Repaglinide'] == 0){
            // score = score + 1;
            // img5.src="pic/ok_w.png";
            // c5r = '答對了，繼續保持!'
            // correctness.push(1);
            const userAnswer = document.getElementById('Repaglinide 1mg/tab r no').value;
            callOpenAI("不給藥", "不給藥", "時間錯誤", userAnswer, "注意醫囑給藥時間與當下時間是否吻合。血糖藥有分飯前給或飯後給，服用Repaglinide需要確認患者是否在吃「第一口飯之前」，尤其老年族群給飯前血糖藥後，要提醒與確認他有進食，以免血糖過低!").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img5.src = "pic/ok_w.png";
                      c5r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(51);
                    } else {
                      img5.src = "pic/wrong_w.png";
                      r5r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(501);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('5 r').innerHTML = c5r;
                document.getElementById('5 r 5').innerHTML = r5r;
                q_time = q_time + 1;
            });

        }else{
            // img5.src="pic/wrong_w.png";
            // r5r = '您不給 Repaglinide 1mg/tab 的理由：' + document.getElementById('Repaglinide 1mg/tab r no').value
            // +'<br> -> 答錯原因：實際給藥錯誤'
            // +'<br>Repaglinide <b style="color: #228de5;">時間錯誤</b>，<font style="color: #00B050;">醫囑時間為 TID/AC</font> (7AM-11AM-16PM)。AC 指飯前給予，<font style="color: #00B050;">情境給藥時間是早上九點，故此藥已過給藥時間</font>'
            // +'<br><font style="color: #f44336;">★ 注意<font style="background-color: yellow;">醫囑給藥時間與當下時間是否吻合</font>。血糖藥有分<b>飯前</b>給或<b>飯後</b>給，服用Repaglinide需要確認患者是否在吃「第一口飯之前」，尤其老年族群給飯前血糖藥後，要提醒與確認他有進食，以免血糖過低！</font>';
            // correctness.push(0);
            // document.getElementById('5 r 5').innerHTML = r5r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('Repaglinide 1mg/tab r no').value;
            callOpenAI("不給藥", "給藥", "時間錯誤", userAnswer, "注意醫囑給藥時間與當下時間是否吻合。血糖藥有分飯前給或飯後給，服用Repaglinide需要確認患者是否在吃「第一口飯之前」，尤其老年族群給飯前血糖藥後，要提醒與確認他有進食，以免血糖過低!").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    img5.src = "pic/wrong_w.png";
                    r5r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(502);
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('5 r').innerHTML = c5r;
                document.getElementById('5 r 5').innerHTML = r5r;
                q_time = q_time + 1;
            });
        }
    }else{
        cognition.push(50);
        img5.src="pic/wrong_w.png";
        r5 = '您給 Repaglinide 1mg/tab 的理由：' + document.getElementById('Repaglinide 1mg/tab r').value
        +'<br>-> 答錯原因：「三讀五對」認知錯誤'
        +'<br>Repaglinide <b style="color: #228de5;">時間錯誤</b>，<font style="color: #00B050;">醫囑時間為 TID/AC</font> (7AM-11AM-16PM)。AC 指飯前給予，<font style="color: #00B050;">情境給藥時間是早上九點，故此藥已過給藥時間</font>'
        +'<br><font style="color: #f44336;">★ 注意<font style="background-color: yellow;">醫囑給藥時間與當下時間是否吻合</font>。血糖藥有分<b>飯前</b>給或<b>飯後</b>給，服用Repaglinide需要確認患者是否在吃「第一口飯之前」，尤其老年族群給飯前血糖藥後，要提醒與確認他有進食，以免血糖過低！</font>';
        document.getElementById('5 r').innerHTML = r5;
        correctness.push(503);
        reason.push(document.getElementById('Repaglinide 1mg/tab r').value);
        q_time = q_time + 1;
    }


    // 6
    var img6 = document.getElementById('6 img');
    
    if (!document.getElementById('check5').checked){
        r6r = ''
        c6r = ''
        // r6r = '您不給 Transamin 250mg/tab 的理由：' + document.getElementById('Transamin 250mg/tab r no').value;
        reason.push(document.getElementById('Transamin 250mg/tab r no').value);
        cognition.push(61);
        if (pill_detect['Transamin'] == 0){
            // score = score + 1;
            // img6.src="pic/ok_w.png";
            // c6r = '答對了，你很棒!'
            // correctness.push(1);
            const userAnswer = document.getElementById('Transamin 250mg/tab r no').value;
            callOpenAI("不給藥", "不給藥", "沒有適應症", userAnswer, "給藥前，必須先確定患者臨床上有服用該藥物的適應症").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img6.src = "pic/ok_w.png";
                      c6r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(61);
                    } else {
                      img6.src = "pic/wrong_w.png";
                      r6r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(601);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('6 r').innerHTML = c6r;
                document.getElementById('6 r 6').innerHTML = r6r;
                q_time = q_time + 1;
            });
        }else{
            // img6.src="pic/wrong_w.png";
            // r6r = '您不給 Transamin 250mg/tab 的理由：' + document.getElementById('Transamin 250mg/tab r no').value
            // +'<br> -> 答錯原因：實際給藥錯誤'
            // +'<br>從目前的病患資訊，<font style="color: #228de5;">病人沒有臨床證據使用 Transamin 的適應症</font>，應向醫師或專科護理師確認是否需要服用此藥'
            // +'<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>';
            // correctness.push(0);
            // document.getElementById('6 r 6').innerHTML = r6r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('Transamin 250mg/tab r no').value;
            callOpenAI("不給藥", "給藥", "沒有適應症", userAnswer, "給藥前，必須先確定患者臨床上有服用該藥物的適應症").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    img6.src = "pic/wrong_w.png";
                    r6r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(602);
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('6 r').innerHTML = c6r;
                document.getElementById('6 r 6').innerHTML = r6r;
                q_time = q_time + 1;
            });
        }
    }else{
        cognition.push(60);
        img6.src="pic/wrong_w.png";
        r6 = '您給 Transamin 250mg/tab 的理由：' + document.getElementById('Transamin 250mg/tab r').value
        +'<br>-> 答錯原因：「三讀五對」認知錯誤'
        +'<br>從目前的病患資訊，<font style="color: #228de5;">病人沒有臨床證據使用 Transamin 的適應症</font>，應向醫師或專科護理師確認是否需要服用此藥'
        +'<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>';
        document.getElementById('6 r').innerHTML = r6;
        correctness.push(603);
        reason.push(document.getElementById('Transamin 250mg/tab r').value);
        q_time = q_time + 1;
    }


    // 7 
    var img7 = document.getElementById('7 img');

    if (!document.getElementById('check6').checked){
        c7r = ''
        r7r = ''
        // r7r = '您不給 Ampicillin 2000mg 500mg/vail 的理由：' + document.getElementById('Ampicillin 2000mg 500mg/vail r no').value;
        reason.push(document.getElementById('Ampicillin 2000mg 500mg/vail r no').value);
        cognition.push(71);
        
        const userAnswer = document.getElementById('Ampicillin 2000mg 500mg/vail r no').value;
        callOpenAI("不給藥", "不給藥", "藥物過敏", userAnswer, "藥物過敏是嚴重可致死 (過敏性休克)，因此給藥前要確認病人是否有藥物過敏，方式包括：問病人藥名、當時過敏反應情形或查詢健保卡和病歷系統記錄 ").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                if (apiResponse[0] == "1") {
                    score += 1;
                    img7.src = "pic/ok_w.png";
                    c7r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(1);
                } else {
                    img7.src = "pic/wrong_w.png";
                    r7r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(0);
                }
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
            document.getElementById('7 r').innerHTML = c7r;
            document.getElementById('7 r 7').innerHTML = r7r;
            q_time = q_time + 1;
        });

    }else{
        cognition.push(70);
        img7.src="pic/wrong_w.png";
        r7 = '您給 Ampicillin 2000mg 500mg/vail 的理由：' + document.getElementById('Ampicillin 2000mg 500mg/vail r').value;
        
        r7 = r7 + '<br> -> 答錯原因：「三讀五對」認知錯誤' + 'Ampicillin 是盤尼西林 Penicillin 類藥物。目前臨床上不需要常規做盤尼西林試驗 Penicillin test, PST。' +
        '<br>但<font style="color: #228de5;">病人對盤尼西林 Penicillin 有過敏記錄，如果醫師仍要給就需要做 PST</font>，因此不應該直接該給藥';
        document.getElementById('7 r').innerHTML = r7;
        correctness.push(0);
        reason.push(document.getElementById('Ampicillin 2000mg 500mg/vail r').value);
        q_time = q_time + 1;
    
    }


    // 8
    var img8 = document.getElementById('8 img');
    
    if (document.getElementById('check7').checked ){
        c8r = ''
        r8r = ''
        // r8r = '您給 Bokey 100mg/tab 的理由：' + document.getElementById('Bokey 100mg/tab r').value;
        reason.push(document.getElementById('Bokey 100mg/tab r').value);
        cognition.push(81);
        if (pill_detect['Bokey'] == 1){
            // score = score + 1;
            // img8.src="pic/ok_w.png";
            // c8r = '你很棒唷~'
            // correctness.push(1);
            const userAnswer = document.getElementById('Bokey 100mg/tab r').value;
            callOpenAI("給藥", "給藥", "預防心肌梗塞", userAnswer, "給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img8.src = "pic/ok_w.png";
                      c8r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(81);
                    } else {
                      img8.src = "pic/wrong_w.png";
                      r8r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(801);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('8 r').innerHTML = c8r;
                document.getElementById('8 r 8').innerHTML = r8r;
                q_time = q_time + 1;
            });
        }else{
            // img8.src="pic/wrong_w.png";
            // r8r = '您給 Bokey 100mg/tab 的理由：' + document.getElementById('Bokey 100mg/tab r').value
            // +'<br> -> 答錯原因：實際給藥錯誤'
            // +'<br> 病人有心臟病， Bokey 可預防心肌梗塞和心栓性栓塞症'
            // +'<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑</font>';
            // correctness.push(0);
            // document.getElementById('8 r 8').innerHTML = r8r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('Bokey 100mg/tab r').value;
            callOpenAI("給藥", "不給藥", "預防心肌梗塞", userAnswer, "給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    img8.src = "pic/wrong_w.png";
                    r8r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(802);
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('8 r').innerHTML = c8r;
                document.getElementById('8 r 8').innerHTML = r8r;
                q_time = q_time + 1;
            });
        }
    }else{
        cognition.push(80);
        img8.src="pic/wrong_w.png";
        r8r = '您不給 Bokey 100mg/tab 的理由：' + document.getElementById('Bokey 100mg/tab r no').value
        +'<br>-> 答錯原因：「三讀五對」認知錯誤'   
        +'<br> 病人有心臟病， Bokey 可預防心肌梗塞和心栓性栓塞症'
        +'<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑</font>';        
        document.getElementById('8 r 8').innerHTML = r8r;
        correctness.push(803);
        reason.push(document.getElementById('Bokey 100mg/tab r no').value);
        q_time = q_time + 1;
    }


    // 9
    var img9 = document.getElementById('9 img');
    
    if (document.getElementById('check8').checked){
        c9r = ''
        r9r = ''
        // r9r = '您給 Simvahexal 20 mg/tab 的理由：' + document.getElementById('Simvahexal 20 mg/tab r').value;
        reason.push(document.getElementById('Simvahexal 20 mg/tab r').value);
        cognition.push(91);
        if (pill_detect['Zocor'] == 1){
            // score = score + 1;
            // img9.src="pic/ok_w.png";
            // correctness.push(1);
            const userAnswer = document.getElementById('Simvahexal 20 mg/tab r').value;
            callOpenAI("給藥", "給藥", "病人有高血脂，Simvahexal可降低血液中的膽固醇和三酸甘油酯", userAnswer, "給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑 ").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img9.src = "pic/ok_w.png";
                      c9r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(91);
                    } else {
                      img9.src = "pic/wrong_w.png";
                      r9r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(901);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('9 r').innerHTML = c9r;
                document.getElementById('9 r 9').innerHTML = r9r;
                q_time = q_time + 1;
            });
        }else{
            // img9.src="pic/wrong_w.png";
            // r9r = '您給 Simvahexal 20 mg/tab 的理由：' + document.getElementById('Simvahexal 20 mg/tab r').value
            // +'<br>-> 答錯原因：實際給藥錯誤'
            // +'<br>病人有高血脂，Simvahexal可降低血液中的膽固醇和三酸甘油酯'
            // +'<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑 </font>';
            // correctness.push(0);
            // document.getElementById('9 r 9').innerHTML = r9r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('Simvahexal 20 mg/tab r').value;
            callOpenAI("給藥", "不給藥", "病人有高血脂，Simvahexal可降低血液中的膽固醇和三酸甘油酯", userAnswer, "給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑 ").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    img9.src = "pic/wrong_w.png";
                    r9r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(902);
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('9 r').innerHTML = c9r;
                document.getElementById('9 r 9').innerHTML = r9r;
                q_time = q_time + 1;
            });
        }
    }else{
        cognition.push(90);
        img9.src="pic/wrong_w.png";
        r9r = '您不給 Simvahexal 20 mg/tab 的理由：' + document.getElementById('Simvahexal 20 mg/tab r no').value
        +'<br>-> 答錯原因：「三讀五對」認知錯誤' 
        +'<br>病人有高血脂，Simvahexal可降低血液中的膽固醇和三酸甘油酯'
        +'<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑 </font>';    
        document.getElementById('9 r 9').innerHTML = r9r;
        correctness.push(903);
        reason.push(document.getElementById('Simvahexal 20 mg/tab r no').value);
        q_time = q_time + 1;
    }


    // 10
    var img10 = document.getElementById('10 img');
    
    if (!document.getElementById('check9').checked){
        c10r = ''
        r10r = ''
        // r10r = '您不給 FLU-D (Fluconazole) 50mg/tab 的理由：' + document.getElementById('FLU-D (Fluconazole) 50mg/tab r no').value;
        reason.push(document.getElementById('FLU-D (Fluconazole) 50mg/tab r no').value);
        cognition.push(991);
        if (pill_detect['FLU'] == 0){
            // score = score + 1;
            // img10.src="pic/ok_w.png";
            // c10r = '你很細心，請繼續保持!'
            // correctness.push(1);     
            const userAnswer = document.getElementById('FLU-D (Fluconazole) 50mg/tab r no').value;
            callOpenAI("不給藥", "不給藥", "藥物交互作用", userAnswer, "藥物-藥物交互作用(drug-drug interaction, DDI)，A藥與B藥一起使用，其相互作用後可能會造成藥效作用延遲、減少或增強任一藥物的吸收而引起不良反應 ").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img10.src = "pic/ok_w.png";
                      c10r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(991);
                    } else {
                      img10.src = "pic/wrong_w.png";
                      r10r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(9901);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('10 r').innerHTML = c10r;
                document.getElementById('10 r 10').innerHTML = r10r;
                q_time = q_time + 1;
            });

        }else{
            // img10.src="pic/wrong_w.png";
            // r10r = '您不給 FLU-D (Fluconazole) 50mg/tab 的理由：' + document.getElementById('FLU-D (Fluconazole) 50mg/tab r no').value
            // +'<br> -> 答錯原因：實際給藥錯誤'
            // +'<br> 病人有後天免疫缺乏症候群，有服用 <font style="color: #228de5;">FLU-D (Fluconazole)</font>的適應症，但它<font style="color: #228de5;">不能與 Simvahexal 合用</font>，會有藥物交互作用 DDI'
            // +'<br><font style="color: #f44336;">★ 藥物-藥物交互作用(drug-drug interaction, DDI)，A藥與B藥一起使用，其相互作用後可能會造成藥效作用延遲、減少或增強任一藥物的吸收而引起不良反應 </font>';
            // correctness.push(0);
            // document.getElementById('10 r 10').innerHTML = r10r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('FLU-D (Fluconazole) 50mg/tab r no').value;
            callOpenAI("不給藥", "給藥", "藥物交互作用", userAnswer, "藥物-藥物交互作用(drug-drug interaction, DDI)，A藥與B藥一起使用，其相互作用後可能會造成藥效作用延遲、減少或增強任一藥物的吸收而引起不良反應 ").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    img10.src = "pic/wrong_w.png";
                    r10r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(9902);
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('10 r').innerHTML = c10r;
                document.getElementById('10 r 10').innerHTML = r10r;
                q_time = q_time + 1;
            });
        }
    }else{
        cognition.push(990);
        img10.src="pic/wrong_w.png";
        r10 = '您給 FLU-D (Fluconazole) 50mg/tab 的理由：' + document.getElementById('FLU-D (Fluconazole) 50mg/tab r').value
        +'<br>-> 答錯原因：「三讀五對」認知錯誤'
        +'<br> 病人有後天免疫缺乏症候群，有服用 <font style="color: #228de5;">FLU-D (Fluconazole)</font>的適應症，但它<font style="color: #228de5;">不能與 Simvahexal 合用</font>，會有藥物交互作用 DDI'
        +'<br><font style="color: #f44336;">★ 藥物-藥物交互作用(drug-drug interaction, DDI)，A藥與B藥一起使用，其相互作用後可能會造成藥效作用延遲、減少或增強任一藥物的吸收而引起不良反應 </font>';
        document.getElementById('10 r').innerHTML = r10;
        correctness.push(9903);
        reason.push(document.getElementById('FLU-D (Fluconazole) 50mg/tab r').value);
        q_time = q_time + 1;
    }

    
    // score
    let checkQTimeInterval = setInterval(() => {
        if (q_time >= 10) {
            // 停止 setInterval
            clearInterval(checkQTimeInterval);
            
            // 顯示分數
            document.getElementById('score').innerHTML = score;
            console.log("correctness----",correctness);
            // 根據分數顯示評語
            if (score >= 7) {
                document.getElementById('review').innerHTML = '高等';
            } else if (score >= 4) {
                document.getElementById('review').innerHTML = '中等';
            } else {
                document.getElementById('review').innerHTML = '低等';
            }
        }
    }, 1000);// score

}   