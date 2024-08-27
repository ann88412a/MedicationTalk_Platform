// 制定回饋規則 打分機制

function feedback(){
    //GPT的部分
    function callOpenAI(rightanswer, userAnswer) {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "assistant", content: "你是一個專業的護理老師，判斷學生給出的答案是否正確，請根據問題使用繁體中文回覆，並且回答的格式為:1/0(1是對0是錯)，答對的話給鼓勵的話，答錯的話告訴他正確答案為何" },
              { role: "user", content: "正確答案為(" + rightanswer + ")，學生回答(" + userAnswer + ")" }
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
    
    var id_name = 'ID：' + document.getElementById('IDF_ID').value + ' 姓名：' + document.getElementById('IDF_name').value;
    $('.ODF_ID')[0].innerText= id_name;

    // 1
    const radios = document.getElementsByName('barcode');
    var img1 = document.getElementById('1 img');
    paitent_r = '';
    if (radios[1].checked){
        cognition.push(1);
        score = score + 1;
        img1.src="pic/ok_w.png";
        paitent_r = '您非常細心，有觀察到病人身分錯誤，繼續保持!';
        // paitent_r = '掃描結果：' + $('.ODF_value')[0].innerText + ',   您判斷是否正確： Yes';
        correctness.push(1);
    }else{
        cognition.push(0);
        img1.src="pic/wrong_w.png";
        paitent_r = '掃描結果：' + $('.ODF_value')[0].innerText + ',   您判斷是否正確： No<br>同名李雅蘭，<b style="color: #228de5;">但出生年月日錯誤</b>(43/02/01)；<font style="color: #00B050;">正確為(28/12/11)</font><br> <font style="color: #f44336;">★ 給藥之前，要先核對患者身份 。 <font style="background-color: yellow;">身份辨識方式</font>包括，詢問對方的「姓名」與「出生年月日」</font>';
        correctness.push(0);
    }
    
    document.getElementById('paitent r').innerHTML = paitent_r;


    // 2
    var img2 = document.getElementById('2 img');
    c2r = '';
    r2r = '';
    if (!document.getElementById('check5').checked){
        c2r = '';
        r2r = '';
        // r2r = '您不給 Concor 5mg/tab 的理由：' + document.getElementById('Concor 5mg/tab r no').value;
        reason.push(document.getElementById('Concor 5mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Cardilo'] == 0 && pill_detect['Concor'] == 0){ 
            // score = score + 1;
            // img2.src="pic/ok_w.png";
            // c2r ='你不給Concor 5mg/tab的理由是因為「'
            // + document.getElementById('Concor 5mg/tab r no').value.trim()
            // + '」你的給藥知識正確並且你實際也沒給病人~很棒~繼續保持';
            // correctness.push(1);
            const userAnswer = document.getElementById('Concor 5mg/tab r no').value;
            callOpenAI("藥物錯誤", userAnswer).then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img2.src = "pic/ok_w.png";
                      c2r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(1);
                    } else {
                      img2.src = "pic/wrong_w.png";
                      r2r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(0);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('2 r').innerHTML = c2r;
                document.getElementById('2 r 2').innerHTML = r2r;
            });

        }else{
            img2.src="pic/wrong_w.png";
            r2r ='你不給Concor 5mg/tab的理由是因為「'
            + document.getElementById('Concor 5mg/tab r no').value.trim()
            + '」<br> -> 答錯原因：實際給藥錯誤'
            +'<br>藥袋內<b style="color: #228de5;">藥物錯誤</b> (Cardio)，<font style="color: #00B050;">正確藥物為 (Concor)</font>'
            +'<br><font style="color: #f44336;">★ 核對不僅是藥袋名稱，還要注意<font style="background-color: yellow;">藥袋內的藥名</font>，<font style="text-decoration:underline;">Concor</font> 和 <font style="text-decoration:underline;">Cardio</font>乍看前面的英文字很像，因此需要小心辨識！</font>';
            correctness.push(0);
            document.getElementById('2 r 2').innerHTML = r2r;
        }

    }else{
        cognition.push(0);
        img2.src="pic/wrong_w.png";
        // r2 = '您給 Concor 5mg/tab 的理由：' + document.getElementById('Concor 5mg/tab r').value;
        r2 = '你給Concor 5mg/tab的理由是因為「'
        + document.getElementById('Concor 5mg/tab r').value.trim()
        +'」<br>-> 答錯原因：MAR單認知錯誤'
        +'<br>藥袋內<b style="color: #228de5;">藥物錯誤</b> (Cardio)，<font style="color: #00B050;">正確藥物為 (Concor)</font>'
        +'<br><font style="color: #f44336;">★ 核對不僅是藥袋名稱，還要注意<font style="background-color: yellow;">藥袋內的藥名</font>，<font style="text-decoration:underline;">Concor</font> 和 <font style="text-decoration:underline;">Cardio</font>乍看前面的英文字很像，因此需要小心辨識！</font>';
        document.getElementById('2 r 2').innerHTML = r2;
        correctness.push(0);
        reason.push(document.getElementById('Concor 5mg/tab r').value);
    
    }
    
    // 3
    var img3 = document.getElementById('3 img');
    c3r = '';
    r3r = '';
    if (!document.getElementById('check4').checked){
        c3r = '';
        r3r = '';
        // r3r = '您不給 Isoptin 40 mg/tab 的理由：' + document.getElementById('Isoptin 40 mg/tab r no').value;
        reason.push(document.getElementById('Isoptin 40 mg/tab r no').value);
        cognition.push(1); // 藥袋內劑量錯誤(240mg)，正確劑量為(40mg)
        if (pill_detect['Isoptin 40mg/tab'] == 0){
            // score = score + 1;
            // img3.src="pic/ok_w.png";
            // c3r ='你不給Isoptin 40 mg/tab的理由是因為「'
            // + document.getElementById('Isoptin 40 mg/tab r no').value.trim()
            // + '」你的給藥知識正確並且你實際也沒給病人~很棒~繼續保持';
            // correctness.push(1);
            const userAnswer = document.getElementById('Isoptin 40 mg/tab r no').value;
            callOpenAI("劑量錯誤", userAnswer).then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img3.src = "pic/ok_w.png";
                      c3r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(1);
                    } else {
                      img3.src = "pic/wrong_w.png";
                      r3r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(0);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('3 r').innerHTML = c3r;
                document.getElementById('3 r 3').innerHTML = r3r;
            });
        }else{
            img3.src="pic/wrong_w.png";
            // r3r = r3r + '\n -> 答錯原因：實際給藥錯誤';
            r3r = '你不給Isoptin 40 mg/tab的理由是因為「'
            + document.getElementById('Isoptin 40 mg/tab r no').value.trim()
            +'」<br>-> 答錯原因：實際給藥錯誤'
            +'<br>藥袋內<b style="color: #228de5;">劑量錯誤</b>(240mg)，<font style="color: #00B050;"><br>正確劑量為(40mg)</font>'
            +'<br><font style="color: #f44336;">★ 同一種藥物會有<font style="background-color: yellow;">不同劑量</font></font>';
            correctness.push(0);
            document.getElementById('3 r 3').innerHTML = r3r;
        }

    }else{
        cognition.push(0);
        img3.src="pic/wrong_w.png";
        // r3 = '您給 Isoptin 40 mg/tab 的理由：' + document.getElementById('Isoptin 40 mg/tab r').value;
        r3 ='不給Isoptin 40 mg/tab的理由是因為「'
        + document.getElementById('Isoptin 40 mg/tab r').value.trim()
        +'」<br>-> 答錯原因：MAR單認知錯誤'
        +'<br>藥袋內<b style="color: #228de5;">劑量錯誤</b>(240mg)，<font style="color: #00B050;">'
        +'<br>正確劑量為(40mg)</font><br><font style="color: #f44336;">★ 同一種藥物會有<font style="background-color: yellow;">不同劑量</font></font>';
        document.getElementById('3 r').innerHTML = r3;
        // r3 = r3 + '\n -> 答錯原因：MAR單認知錯誤';
        correctness.push(0);
        reason.push(document.getElementById('Isoptin 40 mg/tab r').value);
    }


    // 4
    var img4 = document.getElementById('4 img');
    c4r = '';
    r4r = '';
    if (!document.getElementById('check1').checked){
        c4r = '';
        r4r = '';
        // r4r = '您不給 Amikacin 250mg/vail 的理由：' + document.getElementById('Amikacin 250mg/vail r no').value;
        reason.push(document.getElementById('Amikacin 250mg/vail r no').value);
        cognition.push(1);

        const userAnswer = document.getElementById('Amikacin 250mg/vail r no').value;
        callOpenAI("途徑錯誤", userAnswer).then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                if (apiResponse[0] == "1") {
                    score += 1;
                    img4.src = "pic/ok_w.png";
                    c4r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(1);
                } else {
                    img4.src = "pic/wrong_w.png";
                    r4r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(0);
                }
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
            document.getElementById('4 r').innerHTML = c4r;
            document.getElementById('4 r 4').innerHTML = r4r;
        });

    }else{
        cognition.push(0);
        img4.src="pic/wrong_w.png";
        r4 = '您給 Amikacin 250mg/vail 的理由：' + document.getElementById('Amikacin 250mg/vail r').value + "<br> -> 答錯原因:MAR單認知錯誤" +
        '<br>Amikacin<b style="color: #228de5;">途徑不洽當。</b><b style="color: #00B050;">藥物指引建議稀釋給予。</b>'
        + '<br><font style="color: #f44336;">★ </font>Amikacin<font style="color: #f44336;">建議稀釋由靜脈滴注給IV drip</font>100-200ml，且滴注30-60分鐘' + '<br><font style="color: #f44336;">★ 抗生素大多需要稀釋，並且滴注給予</font>';
        document.getElementById('4 r').innerHTML = r4;
        correctness.push(0);
        reason.push(document.getElementById('Amikacin 250mg/vail r').value);
    
    }


    // 5
    var img5 = document.getElementById('5 img');
    c5r = '';
    r5r = '';
    if (!document.getElementById('check3').checked){
        c5r = '';
        r5r = '';
        // r5r = '您不給 Spironolactone 25mg/tab 的理由：' + document.getElementById('Spironolactone 25mg/tab r no').value;
        reason.push(document.getElementById('Spironolactone 25mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Spironolactone'] == 0){ 
            // score = score + 1;
            // img5.src="pic/ok_w.png";
            // c5r ='你不給Spironolactone 25mg/tab的理由是因為「'
            // + document.getElementById('Spironolactone 25mg/tab r no').value.trim()
            // + '」你的給藥知識正確並且你實際也沒給病人~很棒~繼續保持';
            // correctness.push(1);
            const userAnswer = document.getElementById('Spironolactone 25mg/tab r no').value;
            callOpenAI("時間錯誤", userAnswer).then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img5.src = "pic/ok_w.png";
                      c5r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(1);
                    } else {
                      img5.src = "pic/wrong_w.png";
                      r5r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(0);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('5 r').innerHTML = c5r;
                document.getElementById('5 r 5').innerHTML = r5r;
            });

        }else{
            img5.src="pic/wrong_w.png";
            r5r = '你不給Spironolactone 25mg/tab的理由是因為「'
            + document.getElementById('Spironolactone 25mg/tab r no').value.trim()
            + '」<br> -> 答錯原因：實際給藥錯誤'
            +'<br>Spironolactone <b style="color: #228de5;">時間錯誤</b>，醫囑時間為QD/AC (早餐飯前)。情境給藥時間是早上九點，<font style="color: #00B050;">已過給藥時間，</font>'
            +'<br>故此藥目前不能給<font style="color: #00B050;">，應告知醫師</font><br><font style="color: #f44336;">★ 注意<font style="background-color: yellow;">醫囑給藥時間與當下病患狀況是否吻合</font>。</font>';
            correctness.push(0);
            document.getElementById('5 r 5').innerHTML = r5r;
        }

    }else{
        cognition.push(0);
        img5.src="pic/wrong_w.png";
        r5 ='你給Spironolactone 25mg/tab的理由是因為「'
        + document.getElementById('Spironolactone 25mg/tab r').value.trim()
        +'」<br>-> 答錯原因：MAR單認知錯誤'
        +'<br>Spironolactone <b style="color: #228de5;">時間錯誤</b>，醫囑時間為QD/AC (早餐飯前)。情境給藥時間是早上九點，<font style="color: #00B050;">已過給藥時間，</font>'
        +'<br>故此藥目前不能給<font style="color: #00B050;">，應告知醫師</font><br><font style="color: #f44336;">★ 注意<font style="background-color: yellow;">醫囑給藥時間與當下病患狀況是否吻合</font>。</font>';
        // r5 = '您給 Spironolactone 25mg/tab 的理由：' + document.getElementById('Spironolactone 25mg/tab r').value;
        document.getElementById('5 r 5').innerHTML = r5;
        correctness.push(0);
        reason.push(document.getElementById('Spironolactone 25mg/tab r').value);
    
    }


    // 6
    var img6 = document.getElementById('6 img');
    c6r = '';
    r6r = '';
    if (!document.getElementById('check2').checked){
        c6r = '';
        r6r = '';
        // r6r = '您不給 Metformin 500mg/tab 的理由：' + document.getElementById('Metformin 500mg/tab r no').value;
        reason.push(document.getElementById('Metformin 500mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Metformin'] == 0){ 
            // score = score + 1;
            // img6.src="pic/ok_w.png";
            // c6r ='你不給Metformin 500mg/tab的理由是因為「'
            // + document.getElementById('Metformin 500mg/tab r no').value.trim()
            // + '」你的給藥知識正確並且你實際也沒給病人~很棒~繼續保持';
            // correctness.push(1);
            const userAnswer = document.getElementById('Metformin 500mg/tab r no').value;
            callOpenAI("適應症", userAnswer).then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img6.src = "pic/ok_w.png";
                      c6r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(1);
                    } else {
                      img6.src = "pic/wrong_w.png";
                      r6r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(0);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('6 r').innerHTML = c6r;
                document.getElementById('6 r 6').innerHTML = r6r;
            });


        }else{
            img6.src="pic/wrong_w.png";
            r6r = '你不給Metformin 500mg/tab的理由是因為「'
            + document.getElementById('Metformin 500mg/tab r no').value.trim()
            + '」<br> -> 答錯原因：實際給藥錯誤'
            +'<br><font style="color: #228de5;">適應症「暫時」不適合。</font>病人資訊提到<font style="color: #228de5;">「預計早上做注射顯影劑的電腦斷層」，</font>'
            +'<br><font style="color: #00B050;">使用Metformin ，要做注射顯影劑的電腦斷層，檢查前需停用 48 小時</font>'
            +'<br><font style="color: #f44336;">★病人服用 <font style="background-color: yellow;">Metformin ，要注射顯影劑的電腦斷層，其檢查前後需停用 48 小時</font></font>。由於注射顯影劑會暫時加重腎臟過濾雜質的工作負擔，而Metformin的代謝廢物必須經由腎臟排出，一旦藥物的代謝廢物排不出去，可能會引起身體內乳酸中毒';
            correctness.push(0);
            document.getElementById('6 r 6').innerHTML = r6r;

        }

    }else{
        cognition.push(0);
        img6.src="pic/wrong_w.png";
        // r6 = '您給 Metformin 500mg/tab 的理由：' + document.getElementById('Metformin 500mg/tab r').value;
        r6 =  '你給Metformin 500mg/tab的理由是因為「'
        + document.getElementById('Metformin 500mg/tab r').value.trim()
        +'」<br> -> 答錯原因：MAR單認知錯誤'
        +'<br><font style="color: #228de5;">適應症「暫時」不適合。</font>病人資訊提到<font style="color: #228de5;">「預計早上做注射顯影劑的電腦斷層」，</font>'
        +'<br><font style="color: #00B050;">使用Metformin ，要做注射顯影劑的電腦斷層，檢查前需停用 48 小時</font>'
        +'<br><font style="color: #f44336;">★病人服用 <font style="background-color: yellow;">Metformin ，要注射顯影劑的電腦斷層，其檢查前後需停用 48 小時</font></font>。由於注射顯影劑會暫時加重腎臟過濾雜質的工作負擔，而Metformin的代謝廢物必須經由腎臟排出，一旦藥物的代謝廢物排不出去，可能會引起身體內乳酸中毒';
        document.getElementById('6 r 6').innerHTML = r6;
        correctness.push(0);
        reason.push(document.getElementById('Metformin 500mg/tab r').value);
    
    }


    // 7 
    var img7 = document.getElementById('7 img');
    r7r = '';
    c7r = '';
    if (!document.getElementById('check9').checked){
        c7r = '';
        r7r = '';
        // r7r = '您不給 Keto 30mg/amp 的理由：' + document.getElementById('Keto 30mg/amp r no').value;
        reason.push(document.getElementById('Keto 30mg/amp r no').value);
        cognition.push(1);

        const userAnswer = document.getElementById('Keto 30mg/amp r no').value;
        callOpenAI("藥物過敏", userAnswer).then(apiResponse => {
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
        });
        
    }else{
        cognition.push(0);
        img7.src="pic/wrong_w.png";

        // r7 = '您給 Keto 30mg/amp 的理由：' + document.getElementById('Keto 30mg/amp r').value;
        r7 = '你給Keto的理由為:' + document.getElementById('Keto 30mg/amp r').value + ' -> 答錯原因：MAR單認知錯誤<br>Keto 是「<font style="color: #228de5;">非類固醇抗炎藥物</font>」（Non-Steroidal Anti-Inflammatory Drugs，<b style="color: #228de5;"> NSAID </b>） 類藥物。此患者對<b style="color: #228de5;"> NSAID 過敏</b>，因此不能服用Keto<br><font style="color: #f44336;">★ <font style="background-color: yellow;">藥物過敏是嚴重可致死</font> (過敏性休克)，因此給藥前要確認病人是否有藥物過敏，方式包括：問病人藥名、當時過敏反應情形或查詢健保卡和病歷系統記錄</font>';
        document.getElementById('7 r').innerHTML = r7;
        //r7 = r7 + '\n -> 答錯原因：MAR單認知錯誤';
        correctness.push(0);
        reason.push(document.getElementById('Keto 30mg/amp r').value);
    }

    // 8
    var img8 = document.getElementById('8 img');
    r8 = '';
    r8r = '';
    c8r = '';
    if (document.getElementById('check6').checked){
        c8r = '';
        r8r = '';
        // r8 = '您給 Nexium 40mg/tab 的理由：' + document.getElementById('Nexium 40mg/tab r').value;
        reason.push(document.getElementById('Nexium 40mg/tab r').value);
        cognition.push(1);
        if (pill_detect['Nexium'] == 1){
            // score = score + 1;
            // img8.src="pic/ok_w.png";
            // c8r ='你給Nexium 40mg/tab的理由是因為「'
            // + document.getElementById('Nexium 40mg/tab r').value.trim()
            // + '」你的給藥知識正確並且你實際也給病人~很棒~繼續保持';
            // correctness.push(1);
            const userAnswer = document.getElementById('Nexium 40mg/tab r').value;
            callOpenAI("胃潰瘍，使用氫離子幫浦抑制劑PPI抑制胃酸分泌", userAnswer).then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img8.src = "pic/ok_w.png";
                      c8r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(1);
                    } else {
                      img8.src = "pic/wrong_w.png";
                      r8r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(0);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('8 r').innerHTML = c8r;
                document.getElementById('8 r 8').innerHTML = r8r;
            });

        }else{
            img8.src="pic/wrong_w.png";
            // r8 = r8 + '\n -> 答錯原因：實際給藥錯誤';
            r8r = '你給Nexium 40mg/tab的理由是因為「'
            + document.getElementById('Nexium 40mg/tab r').value.trim()
            +'」<br>-> 答錯原因：實際給藥錯誤'
            +'<br>病人有胃潰瘍，使用氫離子幫浦抑制劑PPI是抑制胃酸藥效最佳藥品，會不可逆的結合在鉀/ 氫離子交換幫浦上，完整抑制胃酸分泌'
            +'<br><font style="color: #f44336;">★ <font style="background-color: yellow;">給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>，並且執行給藥醫囑</font>';
            correctness.push(0);
            document.getElementById('8 r 8').innerHTML = r8r;
        }
    }else{
        cognition.push(0);
        img8.src="pic/wrong_w.png";
        // r8r = '您不給 Nexium 40mg/tab 的理由：' + document.getElementById('Nexium 40mg/tab r').value;
        r8r = '你不給Nexium 40mg/tab的理由是因為「'
        + document.getElementById('Nexium 40mg/tab r no').value.trim()
        +'」<br> -> 答錯原因：MAR單認知錯誤'
        +'<br>病人有胃潰瘍，使用氫離子幫浦抑制劑PPI是抑制胃酸藥效最佳藥品，會不可逆的結合在鉀/ 氫離子交換幫浦上，完整抑制胃酸分泌'
        +'<br><font style="color: #f44336;">★ <font style="background-color: yellow;">給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>，並且執行給藥醫囑</font>';
        document.getElementById('8 r 8').innerHTML = r8r;
        // r8r = r8r + '\n -> 答錯原因：MAR單認知錯誤'
        correctness.push(0);
        reason.push(document.getElementById('Nexium 40mg/tab r no').value);
    }


    // 9
    var img9 = document.getElementById('9 img');
    r9r = '';
    c9r = '';
    if (document.getElementById('check7').checked){
        c9r = '';
        r9r = '';
        // r9r = '您給 Lipitor 20mg/tab 的理由：' + document.getElementById('Lipitor 20mg/tab r').value;
        reason.push(document.getElementById('Lipitor 20mg/tab r').value);
        cognition.push(1);
        if (pill_detect['Lipitor'] == 1){ 
            // score = score + 1;
            // img9.src="pic/ok_w.png";
            // c9r ='你給Lipitor 20mg/tab的理由是因為「'
            // + document.getElementById('Lipitor 20mg/tab r').value.trim()
            // + '」你的給藥知識正確並且你實際也給病人~很棒~繼續保持';
            // correctness.push(1);
            const userAnswer = document.getElementById('Lipitor 20mg/tab r').value;
            callOpenAI("高血脂，服用Lipitor可降低血中過高之膽固醇及血脂，減少心血管疾病及中風的發作", userAnswer).then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img9.src = "pic/ok_w.png";
                      c9r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(1);
                    } else {
                      img9.src = "pic/wrong_w.png";
                      r9r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(0);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('9 r').innerHTML = c9r;
                document.getElementById('9 r 9').innerHTML = r9r;
            });

        }else{
            img9.src="pic/wrong_w.png";
            r9r = '你給Lipitor 20mg/tab的理由是因為「'
            + document.getElementById('Lipitor 20mg/tab r').value.trim()
            + '」<br> -> 答錯原因：實際給藥錯誤'
            +'<br>病人有高血脂，服用Lipitor可降低血中過高之膽固醇及血脂，減少心血管疾病及中風的發作'
            +'<br><font style="color: #f44336;">★ <font style="background-color: yellow;">給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>，並且執行給藥醫囑</font>';
            correctness.push(0);
            document.getElementById('9 r 9').innerHTML = r9r;
        }
    }else{
        cognition.push(0);
        img9.src="pic/wrong_w.png";
        // r9 = '您不給 Lipitor 20mg/tab 的理由：' + document.getElementById('Lipitor 20mg/tab r no').value;
        r9 ='你不給Lipitor 20mg/tab的理由是因為「'
        + document.getElementById('Lipitor 20mg/tab r no').value.trim()
        +'」<br> -> 答錯原因：MAR單認知錯誤'
        +'<br>病人有高血脂，服用Lipitor可降低血中過高之膽固醇及血脂，減少心血管疾病及中風的發作'
        +'<br><font style="color: #f44336;">★ <font style="background-color: yellow;">給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>，並且執行給藥醫囑</font>';
        document.getElementById('9 r').innerHTML = r9;
        correctness.push(0);
        reason.push(document.getElementById('Lipitor 20mg/tab r no').value);
    
    }


    // 10
    var img10 = document.getElementById('10 img');
    r10r = '';
    c10r = '';
    r10 ='';
    if (!document.getElementById('check8').checked){
        c10r = '';
        r10r = '';
        // r10r = '您不給 Sandimmun neoral 100mg/tab 的理由：' + document.getElementById('Sandimmun neoral 100mg/tab r no').value;
        reason.push(document.getElementById('Sandimmun neoral 100mg/tab r no').value);
        cognition.push(1);
        if (pill_detect['Sandimmunneoral'] == 0){
            // score = score + 1;
            // img10.src="pic/ok_w.png";
            // c10r ='你不給Sandimmun neoral 100mg/tab的理由是因為「'
            // + document.getElementById('Sandimmun neoral 100mg/tab r no').value.trim()
            // + '」你的給藥知識正確並且你實際也沒給病人~很棒~繼續保持';
            // correctness.push(1);
            const userAnswer = document.getElementById('Sandimmun neoral 100mg/tab r no').value;
            callOpenAI("藥物交互作用", userAnswer).then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img10.src = "pic/ok_w.png";
                      c10r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(1);
                    } else {
                      img10.src = "pic/wrong_w.png";
                      r10r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(0);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('10 r').innerHTML = c10r;
                document.getElementById('10 r 10').innerHTML = r10r;
            });


        }else{
            img10.src="pic/wrong_w.png";
            r10r = '你不給Sandimmun neoral 100mg/tab的理由是因為「'
            + document.getElementById('Sandimmun neoral 100mg/tab r no').value.trim()
            + '」<br> -> 答錯原因：實際給藥錯誤'
            +'<br>病人有嚴重乾癬，有服用<b style="color: #228de5;">Sandimmun neoral</b>的適應症，它<b style="color: #228de5;">與 Lipitor (atorvastatin) 合用</b>，會有藥物交互作用 DDI，這兩種藥物合併使用可能會增加Lipitor在血液中的濃度，因此可能增加其副作用的風險，例如肌肉疼痛或肝臟問題'
            +'<br><font style="color: #f44336;">★ <font style="background-color: yellow;">藥物-藥物交互作用</font>(drug-drug interaction, DDI)，A藥與B藥一起使用，其相互作用後可能會造成藥效作用延遲、減少或增強任一藥物的吸收而引起不良反應 </font>';
            correctness.push(0);
            document.getElementById('10 r 10').innerHTML = r10r;
        }
    }else{
        cognition.push(0);
        img10.src="pic/wrong_w.png";
        // r10 = '您給 Sandimmun neoral 100mg/tab 的理由：' + document.getElementById('Sandimmun neoral 100mg/tab r').value;
        r10 = '你給Sandimmun neoral 100mg/tab的理由是因為「'
        + document.getElementById('Sandimmun neoral 100mg/tab r').value.trim()
        +'」<br>-> 答錯原因：MAR單認知錯誤'
        +'<br>病人有嚴重乾癬，有服用<b style="color: #228de5;">Sandimmun neoral</b>的適應症，它<b style="color: #228de5;">與 Lipitor (atorvastatin) 合用</b>，會有藥物交互作用 DDI，這兩種藥物合併使用可能會增加Lipitor在血液中的濃度，因此可能增加其副作用的風險，例如肌肉疼痛或肝臟問題'
        +'<br><font style="color: #f44336;">★ <font style="background-color: yellow;">藥物-藥物交互作用</font>(drug-drug interaction, DDI)，A藥與B藥一起使用，其相互作用後可能會造成藥效作用延遲、減少或增強任一藥物的吸收而引起不良反應 </font>';
        document.getElementById('10 r').innerHTML = r10;
        correctness.push(0);
        reason.push(document.getElementById('Sandimmun neoral 100mg/tab r').value);
    }

    
    // score
    document.getElementById('score').innerHTML = score;
    if (score >= 7)
    {
        document.getElementById('review').innerHTML = '高等';
    }else if(score >= 4)
    {
        document.getElementById('review').innerHTML = '中等';
    }else
    {
        document.getElementById('review').innerHTML = '低等';
    }

}   