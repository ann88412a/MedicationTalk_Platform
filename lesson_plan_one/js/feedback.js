// 制定回饋規則 打分機制

var q_time=0;
function feedback(){
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

    function callOpenAI2(learnpoint) {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "assistant", content: "你是一個專業的護理老師。學生在判斷是否給藥時出現了問題，請用繁體中文回覆，根據提供的學習重點給學生**簡短鼓勵回饋 (2~3 句)**，並且要指出學生在是否給藥的判斷上出了錯誤。" },
                { role: "user", content: "學習重點:(" + learnpoint + ")" }
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
    // var q_time=0;
    var id_name = 'ID：' + document.getElementById('IDF_ID').value + ' 姓名：' + document.getElementById('IDF_name').value;
    $('.ODF_ID')[0].innerText= id_name;

    // 1
    const radios = document.getElementsByName('barcode');
    var img1 = document.getElementById('1 img');
    paitent_r = ''
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
        paitent_r = '掃描結果：' + $('.ODF_value')[0].innerText + ',   您判斷是否正確： No <br>名字同音；<b style="color: #228de5;">但寫法錯誤</b>(黃岳禮)；<font style="color: #00B050;">正確為(黃月里)</font> <br><font style="color: #f44336;">★ 給藥之前，要先核對患者身份 。 <font style="background-color: yellow;">身份辨識方式</font>包括，詢問對方的「姓名」與「出生年月日」</font>';
        correctness.push(10);
        q_time = q_time + 1;
    }
    
    document.getElementById('paitent r').innerHTML = paitent_r;


    // 2
    var img2 = document.getElementById('2 img');
    if (!document.getElementById('check1').checked){
        // r2r = '您不給 Amiodarone(Cordarone) 150mg/3ml/amp 的理由：' + document.getElementById('Amiodarone(Cordarone) 150mg/3ml/amp r no').value;
        c2r=''
        r2r=''
        reason.push(document.getElementById('Amiodarone(Cordarone) 150mg/3ml/amp r no').value);
        cognition.push(21);
        
        const userAnswer = document.getElementById('Amiodarone(Cordarone) 150mg/3ml/amp r no').value;
        callOpenAI("不給藥", "不給藥", "藥物錯誤", userAnswer, "核對不僅是藥袋名稱，還要注意藥袋內的藥名，Amiodarone 和Amikacin乍看前面的英文字很像，因此需要小心辨識!").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                if (apiResponse[0] == "1") {
                    score += 1;
                    img2.src = "pic/ok_w.png";
                    c2r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(21);
                } else {
                    img2.src = "pic/wrong_w.png";
                    r2r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(20);
                }
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
            document.getElementById('2 r').innerHTML = c2r;
            document.getElementById('2 r 2').innerHTML = r2r;
            q_time = q_time + 1;
        });

    }else{
        cognition.push(20);
        img2.src="pic/wrong_w.png";
        // r2 = '您給 Amiodarone(Cordarone) 150mg/3ml/amp 的理由：' + document.getElementById('Amiodarone(Cordarone) 150mg/3ml/amp r').value;
        callOpenAI2("核對不僅是藥袋名稱，還要注意藥袋內的藥名，Amiodarone 和Amikacin乍看前面的英文字很像，因此需要小心辨識!").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                document.getElementById('2 r').innerHTML = apiResponse;
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
        });
        // r2 = r2 + '<br> -> 答錯原因：「三讀五對」認知錯誤' + 
        // '<br><font style="color: #f44336;">★ 核對不僅是藥袋名稱，還要注意<font style="background-color: yellow;">藥袋內的藥名</font>，<font style="text-decoration:underline;">Amiodarone</font> 和 <font style="text-decoration:underline;">Amikacin</font>乍看前面的英文字很像，因此需要小心辨識！</font>';
        correctness.push(20);
        // document.getElementById('2 r').innerHTML = r2;
        reason.push(document.getElementById('Amiodarone(Cordarone) 150mg/3ml/amp r').value);
        q_time = q_time + 1;
    }
    
    // 3
    var img3 = document.getElementById('3 img');
    r3r = ''
    if (!document.getElementById('check6').checked){
        c3r = ''
        r3r = ''
        // r3r = '您不給 Plavix (Clopidogrel) 75mg/tab 的理由：' + document.getElementById('Plavix (Clopidogrel) 75mg/tab r no').value;
        reason.push(document.getElementById('Plavix (Clopidogrel) 75mg/tab r no').value);
        cognition.push(31); // 實際藥物需要300mg 但實際藥丸只有225mg
        if (pill_detect['Clopidogrel'] == 0){
            const userAnswer = document.getElementById('Plavix (Clopidogrel) 75mg/tab r no').value;
            callOpenAI("不給藥", "不給藥", "劑量錯誤", userAnswer, "病患不一定一次僅服用單顆藥物劑量，因此需要注意給藥的總劑量！特別是當患者需要多種藥物治療或分次服藥時，確保總劑量不超過安全範圍是非常重要的").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                        score += 1;
                        img3.src = "pic/ok_w.png";
                        c3r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                        correctness.push(31);
                    } else {
                        img3.src = "pic/wrong_w.png";
                        r3r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                        correctness.push(30);
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
            // // r3r = r3r + '\n -> 答錯原因：實際給藥錯誤';
            // r3r = '您不給 Plavix (Clopidogrel) 75mg/tab 的理由：' + document.getElementById('Plavix (Clopidogrel) 75mg/tab r no').value 
            // +'<br>-> 答錯原因：實際給藥錯誤'
            // +'<br>藥袋內<b style="color: #228de5;">劑量錯誤</b>225mg(共3顆)，<font style="color: #00B050;">'
            // +'<br>正確劑量為300mg(共4顆)</font>'
            // +'<br> <font style="color: #f44336;">★ 同一種藥物會有「不同的劑量」，因此需要注意<font style="background-color: yellow;">注意給藥的總劑量</font>!特別是當患者需要多種藥物治療或分次服藥時，確保總劑量不超過安全範圍是非常重要的</font>';
            // correctness.push(0);
            // document.getElementById('3 r 3').innerHTML = r3r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('Plavix (Clopidogrel) 75mg/tab r no').value;
            callOpenAI("不給藥", "給藥", "劑量錯誤", userAnswer, "病患不一定一次僅服用單顆藥物劑量，因此需要注意給藥的總劑量！特別是當患者需要多種藥物治療或分次服藥時，確保總劑量不超過安全範圍是非常重要的").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    img3.src = "pic/wrong_w.png";
                    r3r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(30);
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
        // r3 = '您給 Plavix (Clopidogrel) 75mg/tab 的理由：' + document.getElementById('Plavix (Clopidogrel) 75mg/tab r').value;
        // r3 = r3 + '<br> -> 答錯原因：「三讀五對」認知錯誤'
        // +'<br>藥袋內<b style="color: #228de5;">劑量錯誤</b>225mg(共3顆)，<font style="color: #00B050;">'
        // +'<br>正確劑量為300mg(共4顆)</font>'
        // +'<br> <font style="color: #f44336;">★ 同一種藥物會有「不同的劑量」，因此需要注意<font style="background-color: yellow;">注意給藥的總劑量</font>!特別是當患者需要多種藥物治療或分次服藥時，確保總劑量不超過安全範圍是非常重要的</font>';
        callOpenAI2("病患不一定一次僅服用單顆藥物劑量，因此需要注意給藥的總劑量！特別是當患者需要多種藥物治療或分次服藥時，確保總劑量不超過安全範圍是非常重要的").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                document.getElementById('3 r').innerHTML = apiResponse;
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
        });        
        correctness.push(30);
        // document.getElementById('3 r').innerHTML = r3;
        reason.push(document.getElementById('Plavix (Clopidogrel) 75mg/tab r').value);
        q_time = q_time + 1;
    }


    // 4
    var img4 = document.getElementById('4 img');
    if (!document.getElementById('check2').checked){
        c4r = ''
        r4r = ''
        // r4r = '您不給 KCL (Potassium chloride) 20mEq/10mL/amp 的理由：' + document.getElementById('KCL (Potassium chloride) 20mEq/10mL/amp r no').value;
        reason.push(document.getElementById('KCL (Potassium chloride) 20mEq/10mL/amp r no').value);
        cognition.push(41);

        const userAnswer = document.getElementById('KCL (Potassium chloride) 20mEq/10mL/amp r no').value;
        callOpenAI("不給藥", "不給藥", "途徑錯誤", userAnswer, "直接注射KCL會導致致命心律不整等嚴重併發症。KCL須要經稀釋、緩慢輸注，並且需要監測患者的血鉀濃度確保維持在安全範圍內").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                if (apiResponse[0] == "1") {
                    score += 1;
                    img4.src = "pic/ok_w.png";
                    c4r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(41);
                } else {
                    img4.src = "pic/wrong_w.png";
                    r4r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(40);
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
        // r4 = '您給 KCL (Potassium chloride) 20mEq/10mL/amp 的理由：' + document.getElementById('KCL (Potassium chloride) 20mEq/10mL/amp r').value;
        // r4 = r4 + '<br> -> 答錯原因：「三讀五對」認知錯誤' +
        // '<br><font style="color: #f44336;">★ 直接注射KCL會導致致命心律不整等嚴重併發症。KCL須要經稀釋、緩慢輸注，並且需要監測患者的血鉀濃度確保維持在安全範圍內</font>';
        correctness.push(40);
        // document.getElementById('4 r').innerHTML = r4;
        callOpenAI2("直接注射KCL會導致致命心律不整等嚴重併發症。KCL須要經稀釋、緩慢輸注，並且需要監測患者的血鉀濃度確保維持在安全範圍內").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                document.getElementById('4 r').innerHTML = apiResponse;
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
        });       
        reason.push(document.getElementById('KCL (Potassium chloride) 20mEq/10mL/amp r').value);
        q_time = q_time + 1;
    }


    // 5
    var img5 = document.getElementById('5 img');
    
    if (!document.getElementById('check4').checked){
        c5r = ''
        r5r = ''
        // r5r = '您不給 Rolikan (Sodium bicarbonate) 7% 20mL/amp 的理由：' + document.getElementById('Rolikan (Sodium bicarbonate) 7% 20mL/amp r no').value;
        reason.push(document.getElementById('Rolikan (Sodium bicarbonate) 7% 20mL/amp r no').value);
        cognition.push(51);

        
        const userAnswer = document.getElementById('Rolikan (Sodium bicarbonate) 7% 20mL/amp r no').value;
        callOpenAI("不給藥", "不給藥", "時間錯誤", userAnswer, "注意醫囑給藥時間與當下病患狀況是否吻合。").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                if (apiResponse[0] == "1") {
                    score += 1;
                    img5.src = "pic/ok_w.png";
                    c5r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(51);
                } else {
                    img5.src = "pic/wrong_w.png";
                    r5r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(50);
                }
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
            document.getElementById('5 r').innerHTML = c5r;
            document.getElementById('5 r 5').innerHTML = r5r;
            q_time = q_time + 1;
        });

    }else{
        cognition.push(50);
        img5.src="pic/wrong_w.png";
        // r5 = '您給 Rolikan (Sodium bicarbonate) 7% 20mL/amp 的理由：' + document.getElementById('Rolikan (Sodium bicarbonate) 7% 20mL/amp r').value;
        // r5 = r5 + '<br> -> 答錯原因:「三讀五對」認知錯誤' + 
        // '<br><font style="color: #f44336;">★ 注意醫囑給藥時間與當下病患狀況是否吻合。</font>';
        correctness.push(50);
        // document.getElementById('5 r').innerHTML = r5;
        callOpenAI2("注意醫囑給藥時間與當下病患狀況是否吻合。").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                document.getElementById('5 r').innerHTML = apiResponse;
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
        });       
        reason.push(document.getElementById('Rolikan (Sodium bicarbonate) 7% 20mL/amp r').value);
        q_time = q_time + 1;
    
    }


    // 6
    var img6 = document.getElementById('6 img');
    
    if (!document.getElementById('check3').checked){
        c6r = ''
        r6r = ''
        // r6r = '您不給 Cefazolin 1000mg/vail 的理由：' + document.getElementById('Cefazolin 1000mg/vail r no').value;
        reason.push(document.getElementById('Cefazolin 1000mg/vail r no').value);
        cognition.push(61);

        const userAnswer = document.getElementById('Cefazolin 1000mg/vail r no').value;
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
                    correctness.push(60);
                }
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
            document.getElementById('6 r').innerHTML = c6r;
            document.getElementById('6 r 6').innerHTML = r6r;
            q_time = q_time + 1;
        });

    }else{
        cognition.push(60);
        img6.src="pic/wrong_w.png";
        // r6 = '您給 Cefazolin 1000mg/vail 的理由：' + document.getElementById('Cefazolin 1000mg/vail r').value;
        // r6 = r6 + '<br>-> 答錯原因:「三讀五對」認知錯誤' + 
        // '從目前的病患資訊，'+ '<font style="color: #228de5;">病人沒有臨床證據使用 Cefazolin 的適應症</font>' + '，應向醫師或專科護理師確認是否需要服用此藥';
        // + '<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症</font>';
        correctness.push(60);
        // document.getElementById('6 r').innerHTML = r6;
        callOpenAI2("給藥前，必須先確定患者臨床上有服用該藥物的適應症").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                document.getElementById('6 r').innerHTML = apiResponse;
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
        });   
        reason.push(document.getElementById('Cefazolin 1000mg/vail r').value);
        q_time = q_time + 1;
    }


    // 7 
    var img7 = document.getElementById('7 img');
    r7r = ''
    if (!document.getElementById('check7').checked){
        c7r = ''
        r7r = ''
        // r7r = '您不給 Aspirin 100mg/tab 的理由：' + document.getElementById('Aspirin 100mg/tab r no').value;
        reason.push(document.getElementById('Aspirin 100mg/tab r no').value);
        cognition.push(71);
        if (pill_detect['Aspirin'] == 0){
            // score = score + 1;
            // img7.src="pic/ok_w.png";
            // c7r = '你答對了~'
            // correctness.push(1);
            const userAnswer = document.getElementById('Aspirin 100mg/tab r no').value;
            callOpenAI("不給藥", "不給藥", "藥物過敏", userAnswer, "藥物過敏是嚴重可致死 (過敏性休克)，因此給藥前要確認病人是否有藥物過敏，方式包括：問病人藥名、當時過敏反應情形或查詢健保卡和病歷系統記錄 ").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img7.src = "pic/ok_w.png";
                      c7r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(71);
                    } else {
                      img7.src = "pic/wrong_w.png";
                      r7r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(70);
                    }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('7 r').innerHTML = c7r;
                document.getElementById('7 r 7').innerHTML = r7r;
                q_time = q_time + 1;
            });
        }else{
            // img7.src="pic/wrong_w.png";
            // // r7r = r7r + '\n -> 答錯原因：實際給藥錯誤';
            // r7r = '您不給 Aspirin 100mg/tab 的理由：' + document.getElementById('Aspirin 100mg/tab r no').value
            // +'<br>-> 答錯原因：實際給藥錯誤'
            // +'<br>Aspirin 是「<font style="color: #228de5;">非類固醇抗炎藥物</font>」（Non-Steroidal Anti-Inflammatory Drugs，<b style="color: #228de5;"> NSAID </b>） 類藥物。此患者對<b style="color: #228de5;"> NSAID 過敏</b>，因此不能服用Aspirin'
            // +'<br><font style="color: #f44336;">★ 藥物過敏是嚴重可致死 (過敏性休克)，因此給藥前要確認病人是否有藥物過敏，方式包括：問病人藥名、當時過敏反應情形或查詢健保卡和病歷系統記錄</font>';
            // correctness.push(0);
            // document.getElementById('7 r 7').innerHTML = r7r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('Aspirin 100mg/tab r no').value;
            callOpenAI("不給藥", "給藥", "藥物過敏", userAnswer, "藥物過敏是嚴重可致死 (過敏性休克)，因此給藥前要確認病人是否有藥物過敏，方式包括：問病人藥名、當時過敏反應情形或查詢健保卡和病歷系統記錄 ").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    img7.src = "pic/wrong_w.png";
                    r7r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(70);
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('7 r').innerHTML = c7r;
                document.getElementById('7 r 7').innerHTML = r7r;
                q_time = q_time + 1;
            });
        }
    }else{
        cognition.push(70);
        img7.src="pic/wrong_w.png";
        // r7 = '您給 Aspirin 100mg/tab 的理由：' + document.getElementById('Aspirin 100mg/tab r').value;
        // r7 = r7 + '<br>-> 答錯原因：「三讀五對」認知錯誤'
        // +'<br>Aspirin 是「<font style="color: #228de5;">非類固醇抗炎藥物</font>」（Non-Steroidal Anti-Inflammatory Drugs，<b style="color: #228de5;"> NSAID </b>） 類藥物。此患者對<b style="color: #228de5;"> NSAID 過敏</b>，因此不能服用Aspirin'
        // +'<br><font style="color: #f44336;">★ 藥物過敏是嚴重可致死 (過敏性休克)，因此給藥前要確認病人是否有藥物過敏，方式包括：問病人藥名、當時過敏反應情形或查詢健保卡和病歷系統記錄</font>';
        correctness.push(70);
        // document.getElementById('7 r').innerHTML = r7;
        callOpenAI2("藥物過敏是嚴重可致死 (過敏性休克)，因此給藥前要確認病人是否有藥物過敏，方式包括：問病人藥名、當時過敏反應情形或查詢健保卡和病歷系統記錄").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                document.getElementById('7 r').innerHTML = apiResponse;
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
        });   
        reason.push(document.getElementById('Aspirin 100mg/tab r').value);
        q_time = q_time + 1;
    }

    // 8
    var img8 = document.getElementById('8 img');
    r8 = ''
    if (document.getElementById('check8').checked){
        c8r = ''
        r8r = ''
        // r8 = '您給 Tulip （Atorvastatin）20mg/tab 的理由：' + document.getElementById('Tulip （Atorvastatin）20mg/tab r').value;
        reason.push(document.getElementById('Tulip （Atorvastatin）20mg/tab r').value);
        cognition.push(81);
        if (pill_detect['Tulip'] == 1){
            // score = score + 1;
            // img8.src="pic/ok_w.png";
            // c8r = '你是最棒的!'
            // correctness.push(1);
            const userAnswer = document.getElementById('Tulip （Atorvastatin）20mg/tab r').value;
            callOpenAI("給藥", "給藥", "避免粥樣硬化造成栓塞或降低心肌梗塞風險", userAnswer, "給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img8.src = "pic/ok_w.png";
                      c8r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(81);
                  } else {
                      img8.src = "pic/wrong_w.png";
                      r8r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(80);
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
            // // r8 = r8 + '\n -> 答錯原因：實際給藥錯誤';
            // r8r= '您給 Tulip （Atorvastatin）20mg/tab 的理由：' + document.getElementById('Tulip （Atorvastatin）20mg/tab r').value
            // +'<br> -> 答錯原因：實際給藥錯誤'
            // +'<br>Tulip（學名為Atorva<font style="text-decoration:underline; color: #f44336;">statin</font>）屬於Statin類藥物。'
            // +'<br>病人是急性心肌梗塞（Acute Myocardial Infarction, AMI），研究已證實<b style="color: #228de5;"> AMI </b>患者，使用Statin藥物能明顯有助於改善預後，像是：穩定動脈粥樣硬化斑塊、降低血栓形成的風險，還能減少心肌梗塞的大小和心肌損傷的程度'
            // +'<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑</font>';
            // correctness.push(0);
            // document.getElementById('8 r 8').innerHTML = r8r;
            // q_time = q_time + 1;
            const userAnswer = document.getElementById('Tulip （Atorvastatin）20mg/tab r').value;
            callOpenAI("給藥", "不給藥", "避免粥樣硬化造成栓塞或降低心肌梗塞風險", userAnswer, "給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {               
                    img8.src = "pic/wrong_w.png";
                    r8r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                    correctness.push(80);  
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
        // r8r = '您不給 Tulip （Atorvastatin）20mg/tab 的理由：' + document.getElementById('Tulip （Atorvastatin）20mg/tab r no').value;
        // r8r = r8r + '<br>-> 答錯原因：「三讀五對」認知錯誤'
        // +'<br>Tulip（學名為Atorva<font style="text-decoration:underline; color: #f44336;">statin</font>）屬於Statin類藥物。'
        // +'<br>病人是急性心肌梗塞（Acute Myocardial Infarction, AMI），研究已證實<b style="color: #228de5;"> AMI </b>患者，使用Statin藥物能明顯有助於改善預後，像是：穩定動脈粥樣硬化斑塊、降低血栓形成的風險，還能減少心肌梗塞的大小和心肌損傷的程度'
        // +'<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑</font>';
        correctness.push(80);
        // document.getElementById('8 r 8').innerHTML = r8r;
        callOpenAI2("給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                document.getElementById('8 r 8').innerHTML = apiResponse;
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
        });   
        reason.push(document.getElementById('Tulip （Atorvastatin）20mg/tab r no').value);
        q_time = q_time + 1;
    }


    // 9
    var img9 = document.getElementById('9 img');
    
    if (document.getElementById('check5').checked){
        c9r = ''
        r9r = ''
        // r9r = '您給 Heparin 25000units/vail 的理由：' + document.getElementById('Heparin 25000units/vail r').value;
        reason.push(document.getElementById('Heparin 25000units/vail r').value);
        cognition.push(91);
        if (medicines['Heparin 25000units/vail']['verification']=='4710031297121' && 0.75<=medicines['Heparin 25000units/vail']['injection'] && medicines['Heparin 25000units/vail']['injection']<=0.85 && medicines['Heparin 25000units/vail']['way'][0]=='IVP' && medicines['Heparin 25000units/vail']['dilution']=="0"){ 
            const userAnswer = document.getElementById('Tulip （Atorvastatin）20mg/tab r').value;
            callOpenAI("給藥", "給藥", "預防血栓", userAnswer, "給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑").then(apiResponse => {
                if (apiResponse && typeof apiResponse === 'string') {
                    if (apiResponse[0] == "1") {
                      score += 1;
                      img9.src = "pic/ok_w.png";
                      c9r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(91);
                  } else {
                      img9.src = "pic/wrong_w.png";
                      r9r = apiResponse.replace(/^[^\u4e00-\u9fa5]+/, '');
                      correctness.push(90);
                  }
                } else {
                console.error('API response is not a valid string:', apiResponse);
                }
                document.getElementById('9 r').innerHTML = c9r;
                document.getElementById('9 r 9').innerHTML = r9r;
                q_time = q_time + 1;
            });

            document.getElementById('9 r 9').innerHTML = r9r;
            console.log(medicines['Heparin 25000units/vail']['verification']!=null);
            console.log(0.75<=medicines['Heparin 25000units/vail']['injection']<=0.85);
            console.log(medicines['Heparin 25000units/vail']['way']==['IVP']);
            console.log(medicines['Heparin 25000units/vail']['dilution']=="0");
        }
    }
    else{
        cognition.push(90);
        img9.src="pic/wrong_w.png";
        // r9 = '您不給 Heparin 25000units/vail 的理由：' + document.getElementById('Heparin 25000units/vail r no').value + '<br> -> 答錯原因：「三讀五對」認知錯誤'
        // +'<br>病人是急性心肌梗塞（AMI），肝素（Heparin）為抗凝血藥物，在急性冠心症發生時，為class I的適應症'
        // +'<br><font style="color: #f44336;">★ 給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑 </font>';
        // document.getElementById('9 r').innerHTML = r9;
        callOpenAI2("給藥前，必須先確定患者臨床上有服用該藥物的適應症，並且執行給藥醫囑").then(apiResponse => {
            if (apiResponse && typeof apiResponse === 'string') {
                document.getElementById('9 r').innerHTML = apiResponse;
            } else {
            console.error('API response is not a valid string:', apiResponse);
            }
        }); 
        correctness.push(90);
        reason.push(document.getElementById('Heparin 25000units/vail r no').value);
        q_time = q_time + 1;
    
    }


    // 10
    // var img10 = document.getElementById('10 img');
    
    // if (!document.getElementById('check9').checked){
    //     r10r = '您不給 FLU-D (Fluconazole) 50mg/tab 的理由：' + document.getElementById('FLU-D (Fluconazole) 50mg/tab r no').value;
    //     reason.push(document.getElementById('FLU-D (Fluconazole) 50mg/tab r no').value);
    //     cognition.push(1);
    //     if (pill_detect['FLU'] == 0){
    //         score = score + 1;
    //         img10.src="pic/ok_w.png";
    //         correctness.push(1);

    //     }else{
    //         img10.src="pic/wrong_w.png";
    //         r10r = r10r + '\n -> 答錯原因：實際給藥錯誤';
    //         correctness.push(0);
    //     }

    //     document.getElementById('10 r 10').innerHTML = r10r;
    // }else{
    //     cognition.push(0);
    //     img10.src="pic/wrong_w.png";
    //     r10 = '您給 FLU-D (Fluconazole) 50mg/tab 的理由：' + document.getElementById('FLU-D (Fluconazole) 50mg/tab r').value;
    //     document.getElementById('10 r').innerHTML = r10;
    //     correctness.push(1);
    //     reason.push(document.getElementById('FLU-D (Fluconazole) 50mg/tab r').value);
    // }

    
    // score
    let checkQTimeInterval = setInterval(() => {
        if (q_time >= 9) {
            // 停止 setInterval
            clearInterval(checkQTimeInterval);
            
            // 顯示分數
            document.getElementById('score').innerHTML = score;
    
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