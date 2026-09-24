<!DOCTYPE html>

<html lang="fa" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>خروجی گزارش | کافی‌نت جانا</title>

<style>

*{

    box-sizing:border-box;

    margin:0;

    padding:0;

}

html{

    scroll-behavior:smooth;

}

body{

    min-height:100vh;

    background:

        radial-gradient(circle at 85% 5%,rgba(0,140,255,.08),transparent 30%),

        radial-gradient(circle at 10% 90%,rgba(0,80,255,.07),transparent 30%),

        #020508;

    color:#fff;

    font-family:Tahoma,Arial,sans-serif;

    overflow-x:hidden;

    padding-bottom:30px;

}

body::before,

body::after{

    content:"";

    position:fixed;

    width:450px;

    height:450px;

    border-radius:50%;

    filter:blur(130px);

    opacity:.15;

    pointer-events:none;

    z-index:0;

    animation:floatOrb 9s ease-in-out infinite alternate;

}

body::before{

    background:#008cff;

    top:-220px;

    right:-160px;

}

body::after{

    background:#0066ff;

    bottom:-230px;

    left:-160px;

    animation-delay:2s;

}

@keyframes floatOrb{

    from{

        transform:translate(0,0) scale(1);

    }

    to{

        transform:translate(35px,25px) scale(1.08);

    }

}

/* =========================

   Mouse Glow

========================= */

.mouseGlow{

    position:fixed;

    width:340px;

    height:340px;

    border-radius:50%;

    pointer-events:none;

    background:radial-gradient(

        circle,

        rgba(0,140,255,.16),

        rgba(0,100,255,.06) 35%,

        transparent 72%

    );

    transform:translate(-50%,-50%);

    z-index:1;

}

.cursorDot{

    position:fixed;

    width:7px;

    height:7px;

    border-radius:50%;

    background:#35aaff;

    box-shadow:

        0 0 8px #008cff,

        0 0 18px #008cff,

        0 0 30px rgba(0,140,255,.8);

    pointer-events:none;

    transform:translate(-50%,-50%);

    z-index:9999;

}

/* =========================

   Container

========================= */

.container{

    position:relative;

    z-index:5;

    width:min(1250px,94%);

    margin:auto;

    padding:35px 0 60px;

}

/* =========================

   Header

========================= */

.header{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:20px;

    margin-bottom:28px;

}

.title h1{

    font-size:30px;

    margin-bottom:8px;

    text-shadow:0 0 25px rgba(0,140,255,.15);

}

.title p{

    color:#7290aa;

    font-size:13px;

}

.headerActions{

    display:flex;

    gap:10px;

}

.back,

.printBtn{

    text-decoration:none;

    color:#83bfff;

    border:1px solid rgba(0,140,255,.2);

    background:rgba(255,255,255,.04);

    padding:12px 17px;

    border-radius:13px;

    transition:.3s;

    cursor:pointer;

    font-family:inherit;

}

.back:hover,

.printBtn:hover{

    transform:translateY(-3px);

    background:rgba(0,140,255,.1);

    border-color:#168cff;

    box-shadow:0 10px 30px rgba(0,140,255,.08);

}

/* =========================

   Stats

========================= */

.stats{

    display:grid;

    grid-template-columns:repeat(5,1fr);

    gap:16px;

    margin-bottom:22px;

}

.stat{

    direction:rtl;

    position:relative;

    overflow:hidden;

    min-height:130px;

    padding:22px;

    border-radius:23px;

    background:linear-gradient(

        145deg,

        rgba(255,255,255,.07),

        rgba(255,255,255,.025)

    );

    border:1px solid rgba(255,255,255,.09);

    backdrop-filter:blur(25px);

    -webkit-backdrop-filter:blur(25px);

    box-shadow:

        0 25px 60px rgba(0,0,0,.3),

        inset 0 1px rgba(255,255,255,.05);

    transition:.35s;

}

.stat::after{

    content:"";

    position:absolute;

    width:100px;

    height:100px;

    border-radius:50%;

    background:rgba(0,140,255,.08);

    filter:blur(30px);

    top:-50px;

    left:-40px;

}

.stat:hover{

    transform:translateY(-7px);

    border-color:rgba(0,140,255,.4);

    box-shadow:

        0 30px 70px rgba(0,0,0,.45),

        0 0 30px rgba(0,140,255,.08);

}

.cashStatCard{

    cursor:pointer;

    user-select:none;

}

.cashStatCard:focus-visible{

    outline:2px solid rgba(0,140,255,.55);

    outline-offset:3px;

}

.cashCardHint{

    position:absolute;

    right:22px;

    bottom:14px;

    color:#62839c;

    font-size:9px;

    opacity:.9;

}

.cashCardArrow{

    position:absolute;

    left:18px;

    bottom:12px;

    width:25px;

    height:25px;

    display:flex;

    align-items:center;

    justify-content:center;

    border-radius:50%;

    border:1px solid rgba(110,200,255,.20);

    background:rgba(0,140,255,.07);

    color:#73c8ff;

    font-size:17px;

    transition:.25s;

}

.cashStatCard:hover .cashCardArrow{

    transform:translateY(3px);

    background:rgba(0,140,255,.14);

    box-shadow:0 0 18px rgba(0,140,255,.15);

}

.cashWithdrawalOverlay{

    position:fixed;

    inset:0;

    z-index:12500;

    display:none;

    align-items:center;

    justify-content:center;

    padding:20px;

    background:rgba(0,0,0,.54);

    backdrop-filter:blur(9px);

    -webkit-backdrop-filter:blur(9px);

}

.cashWithdrawalOverlay.open{

    display:flex;

    animation:cashOverlayIn .18s ease both;

}

.cashWithdrawalCard{

    position:relative;

    width:min(500px,94vw);

    max-height:min(720px,88vh);

    overflow:auto;

    direction:rtl;

    padding:25px;

    border-radius:27px;

    border:1px solid rgba(255,255,255,.16);

    background:linear-gradient(145deg,rgba(10,29,44,.94),rgba(2,9,16,.96));

    backdrop-filter:blur(32px);

    -webkit-backdrop-filter:blur(32px);

    box-shadow:0 35px 100px rgba(0,0,0,.72),0 0 45px rgba(0,140,255,.10),inset 0 1px rgba(255,255,255,.08);

    animation:cashCardIn .30s cubic-bezier(.2,.8,.2,1) both;

}

.cashWithdrawalCard::-webkit-scrollbar{width:5px}

.cashWithdrawalCard::-webkit-scrollbar-thumb{background:rgba(0,140,255,.25);border-radius:10px}

.cashWithdrawalClose{

    position:absolute;

    top:13px;

    left:13px;

    z-index:3;

    width:39px;

    height:39px;

    border-radius:50%;

    border:1px solid rgba(255,255,255,.15);

    background:rgba(255,255,255,.055);

    color:#b7cddd;

    font-size:25px;

    line-height:1;

    cursor:pointer;

    display:flex;

    align-items:center;

    justify-content:center;

    transition:.24s;

    box-shadow:inset 0 1px rgba(255,255,255,.08),0 9px 25px rgba(0,0,0,.22);

}

.cashWithdrawalClose:hover{

    transform:rotate(90deg) scale(1.08);

    background:rgba(255,75,75,.16);

    border-color:rgba(255,120,120,.45);

    color:#fff;

    box-shadow:0 0 26px rgba(255,80,80,.16);

}

.cashWithdrawalClose:active{transform:scale(.93)}

.cashWithdrawalHead{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:15px;

    padding-left:50px;

    margin-bottom:21px;

}

.cashWithdrawalTitle{font-size:19px;color:#eaf6ff;font-weight:700}

.cashWithdrawalSub{font-size:10px;color:#6f8da3;margin-top:5px}

.cashWithdrawalToggle{

    position:absolute;

    left:50%;

    bottom:-19px;

    transform:translateX(-50%);

    width:38px;

    height:38px;

    z-index:5;

    border-radius:50%;

    border:1px solid rgba(110,200,255,.24);

    background:rgba(5,22,35,.94);

    color:#7ecbff;

    cursor:pointer;

    font-size:19px;

    display:flex;

    align-items:center;

    justify-content:center;

    transition:.25s;

    box-shadow:0 8px 24px rgba(0,0,0,.35),0 0 18px rgba(0,140,255,.10);

    backdrop-filter:blur(14px);

    -webkit-backdrop-filter:blur(14px);

}

.cashWithdrawalToggle:hover{

    transform:translateX(-50%) translateY(2px) scale(1.08);

    background:rgba(0,140,255,.14);

    box-shadow:0 0 24px rgba(0,140,255,.18),0 10px 28px rgba(0,0,0,.35);

}

.cashWithdrawalToggle.open{transform:translateX(-50%) rotate(180deg)}

.cashWithdrawalToggle.open:hover{transform:translateX(-50%) rotate(180deg) scale(1.06)}

.cashWithdrawalForm{display:grid;gap:8px}

.cashWithdrawalForm label{color:#7893a8;font-size:10px;margin-top:4px}

.cashAmountInputWrap{

    display:flex;

    align-items:center;

    gap:9px;

    padding:0 13px;

    border-radius:15px;

    border:1px solid rgba(255,255,255,.10);

    background:rgba(255,255,255,.035);

    transition:.22s;

}

.cashAmountInputWrap:focus-within{

    border-color:rgba(0,140,255,.40);

    box-shadow:0 0 24px rgba(0,140,255,.08);

}

.cashAmountInputWrap input{

    width:100%;

    min-height:48px;

    border:0;

    outline:0;

    background:transparent;

    color:#fff;

    font-family:inherit;

    font-size:14px;

}

.cashAmountInputWrap span{color:#62849c;font-size:10px;white-space:nowrap}

.cashWithdrawalForm textarea{

    width:100%;

    resize:vertical;

    min-height:80px;

    border-radius:15px;

    border:1px solid rgba(255,255,255,.10);

    outline:0;

    background:rgba(255,255,255,.035);

    color:#fff;

    padding:12px;

    font-family:inherit;

    font-size:11px;

    transition:.22s;

}

.cashWithdrawalForm textarea:focus{

    border-color:rgba(0,140,255,.40);

    box-shadow:0 0 24px rgba(0,140,255,.08);

}

.cashWithdrawalActions{

    display:flex;

    gap:9px;

    margin-top:17px;

}

.cashWithdrawalActions button{

    border-radius:14px;

    min-height:45px;

    padding:0 17px;

    font-family:inherit;

    cursor:pointer;

    transition:.22s;

}

.cashCancelBtn{

    border:1px solid rgba(255,255,255,.09);

    background:rgba(255,255,255,.04);

    color:#91a8ba;

}

.cashCancelBtn:hover{

    transform:translateY(-2px);

    color:#fff;

}

.cashWithdrawBtn{

    flex:1;

    border:1px solid rgba(34,197,94,.28);

    background:linear-gradient(135deg,rgba(34,197,94,.16),rgba(0,120,255,.10));

    color:#9af2bd;

    box-shadow:0 0 24px rgba(34,197,94,.06);

}

.cashWithdrawBtn:hover{

    transform:translateY(-2px);

    background:linear-gradient(135deg,rgba(34,197,94,.23),rgba(0,120,255,.14));

}

.cashWithdrawBtn:disabled{opacity:.55;cursor:wait;transform:none}

.cashWithdrawalHistory{

    display:none;

    margin-top:17px;

    padding-top:14px;

    border-top:1px solid rgba(255,255,255,.07);

}

.cashWithdrawalHistory.open{display:block;animation:cashHistoryIn .24s ease both}

.cashHistoryTitle{font-size:11px;color:#a9c8dc;margin-bottom:9px}

.cashHistoryItem{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:12px;

    padding:10px 12px;

    margin-top:7px;

    border-radius:14px;

    border:1px solid rgba(255,255,255,.07);

    background:rgba(255,255,255,.035);

}

.cashHistoryMain{min-width:0}

.cashHistoryAmount{color:#ff9b9b;font-weight:700;font-size:12px}

.cashHistoryDesc{color:#7692a7;font-size:9px;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:280px}

.cashHistoryDate{color:#5f7b91;font-size:8px;white-space:nowrap}

.cashHistoryEmpty{color:#5f7b91;font-size:10px;text-align:center;padding:14px 0}

@keyframes cashOverlayIn{from{opacity:0}to{opacity:1}}

@keyframes cashCardIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}

@keyframes cashHistoryIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}

.stat small{

    color:#70869b;

    font-size:12px;

}

.stat strong{

    display:block;

    margin-top:15px;

    font-size:22px;

    color:#49adff;

    position:relative;

    z-index:2;

}

.statIcon{

    position:absolute;

    left:18px;

    top:17px;

    font-size:25px;

    opacity:.75;

}

/* =========================

   Glass Panels

========================= */

.panel{

    position:relative;

    background:linear-gradient(

        145deg,

        rgba(255,255,255,.065),

        rgba(255,255,255,.025)

    );

    border:1px solid rgba(255,255,255,.09);

    border-radius:26px;

    padding:25px;

    backdrop-filter:blur(28px);

    -webkit-backdrop-filter:blur(28px);

    box-shadow:

        0 25px 70px rgba(0,0,0,.35),

        inset 0 1px rgba(255,255,255,.05);

    margin-bottom:22px;

    overflow:hidden;

}

.panel::before{

    content:"";

    position:absolute;

    inset:0;

    pointer-events:none;

    background:linear-gradient(

        120deg,

        rgba(255,255,255,.035),

        transparent 35%

    );

}

.panelTitle{

    position:relative;

    z-index:2;

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:15px;

    margin-bottom:20px;

}

.panelTitle h2{

    font-size:19px;

}

.panelTitle span{

    color:#66829c;

    font-size:12px;

}

/* =========================

   Glass Bubble Income

========================= */

.chartWrap{

    position:relative;

    min-height:330px;

    display:flex;

    align-items:center;

    justify-content:center;

    overflow:hidden;

}

.incomeBubble{

    position:relative;

    width:275px;

    height:275px;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    text-align:center;

    background:

        radial-gradient(

            circle at 32% 25%,

            rgba(255,255,255,.28),

            rgba(255,255,255,.08) 25%,

            rgba(0,140,255,.09) 58%,

            rgba(0,80,180,.035)

        );

    border:1px solid rgba(255,255,255,.22);

    backdrop-filter:blur(25px);

    -webkit-backdrop-filter:blur(25px);

    box-shadow:

        inset 12px 12px 35px rgba(255,255,255,.06),

        inset -15px -15px 35px rgba(0,80,180,.08),

        0 25px 70px rgba(0,0,0,.45);

    animation:bubbleFloat 4s ease-in-out infinite;

}

.incomeBubble::before{

    content:"";

    position:absolute;

    inset:-5px;

    border-radius:50%;

    background:conic-gradient(

        from 0deg,

        transparent 0deg,

        transparent 35deg,

        #008cff 80deg,

        #6ec8ff 120deg,

        transparent 170deg,

        transparent 360deg

    );

    -webkit-mask:

        linear-gradient(#000 0 0) content-box,

        linear-gradient(#000 0 0);

    -webkit-mask-composite:xor;

    mask-composite:exclude;

    padding:3px;

    animation:rotateGlow 2.8s linear infinite;

    filter:

        drop-shadow(0 0 7px #008cff)

        drop-shadow(0 0 16px rgba(0,140,255,.75));

}

.incomeBubble::after{

    content:"";

    position:absolute;

    width:65px;

    height:30px;

    border-radius:50%;

    top:28px;

    left:42px;

    background:rgba(255,255,255,.12);

    filter:blur(5px);

    transform:rotate(-25deg);

}

@keyframes rotateGlow{

    from{

        transform:rotate(0deg);

    }

    to{

        transform:rotate(360deg);

    }

}

@keyframes bubbleFloat{

    0%,100%{

        transform:translateY(0) scale(1);

    }

    50%{

        transform:translateY(-13px) scale(1.025);

    }

}

.bubbleContent{

    position:relative;

    z-index:3;

    display:flex;

    flex-direction:column;

    align-items:center;

    gap:8px;

}

.bubbleIcon{

    font-size:31px;

    filter:drop-shadow(

        0 0 10px rgba(0,140,255,.5)

    );

}

.bubbleLabel{

    color:#7692aa;

    font-size:12px;

}

.bubbleAmount{

    color:#64bdff;

    font-size:22px;

    font-weight:bold;

    text-shadow:

        0 0 15px rgba(0,140,255,.3);

}

/* =========================

   Chart Button

========================= */

.chartButtonWrap{

    position:relative;

    z-index:5;

    display:flex;

    justify-content:center;

    margin-top:-15px;

    padding-bottom:5px;

}

.chartButton{

    border:1px solid rgba(0,140,255,.35);

    background:linear-gradient(

        135deg,

        rgba(0,140,255,.18),

        rgba(0,80,255,.08)

    );

    color:#7bc5ff;

    padding:11px 25px;

    border-radius:13px;

    cursor:pointer;

    font-family:inherit;

    transition:.3s;

    box-shadow:0 0 25px rgba(0,140,255,.06);

}

.chartButton:hover{

    transform:translateY(-3px);

    border-color:#168cff;

    background:rgba(0,140,255,.18);

    box-shadow:0 10px 30px rgba(0,140,255,.13);

}

/* =========================

   Income Hub

========================= */

.incomeHubPanel{

    overflow:hidden;

}

.incomeHubBubbleWrap{

    display:flex;

    justify-content:center;

    align-items:center;

    padding:6px 0 22px;

}

.incomeHubBubbleWrap .incomeBubble{

    margin:0 auto;

}

.incomeHubPanel.incomeSlideAway{

    animation:incomeSlideOut .38s cubic-bezier(.22,.8,.2,1) both;

}

.incomeDetailPanel.incomeSlideIn{

    animation:incomeSlideIn .42s cubic-bezier(.22,.8,.2,1) both;

}

@keyframes incomeSlideOut{

    from{opacity:1;transform:translateX(0);}

    to{opacity:0;transform:translateX(-90px);}

}

@keyframes incomeSlideIn{

    from{opacity:0;transform:translateX(90px);}

    to{opacity:1;transform:translateX(0);}

}

.incomeHubOptions{

    display:flex;

    justify-content:center;

    align-items:center;

    padding:0 0 8px;

}

.incomeHubOptions .incomeHubOption{

    width:min(310px,88%);

    min-height:58px;

    padding:11px 15px;

    border-radius:17px;

    gap:10px;

}

.incomeHubOptions .incomeHubOptionIcon{

    flex:0 0 38px;

    width:38px;

    height:38px;

    border-radius:12px;

    font-size:18px;

}

.incomeHubOptions .incomeHubOptionText{

    gap:2px;

}

.incomeHubOptions .incomeHubOptionText strong{

    font-size:13px;

}

.incomeHubOptions .incomeHubOptionText small{

    font-size:9px;

}

.incomeHubOption{

    position:relative;

    min-height:92px;

    display:flex;

    align-items:center;

    gap:14px;

    padding:18px 20px;

    border-radius:22px;

    border:1px solid rgba(255,255,255,.13);

    background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.035));

    color:#d9e8f2;

    cursor:pointer;

    text-align:right;

    backdrop-filter:blur(18px);

    -webkit-backdrop-filter:blur(18px);

    box-shadow:inset 0 1px rgba(255,255,255,.08),0 14px 38px rgba(0,0,0,.18);

    transition:.24s ease;

    overflow:hidden;

}

.incomeHubOption::before{

    content:"";

    position:absolute;

    width:120px;

    height:120px;

    border-radius:50%;

    left:-55px;

    top:-55px;

    background:rgba(0,140,255,.08);

    filter:blur(2px);

}

.incomeHubOption:hover{

    transform:translateY(-4px);

    border-color:rgba(110,200,255,.35);

    background:linear-gradient(145deg,rgba(0,140,255,.13),rgba(255,255,255,.05));

    box-shadow:inset 0 1px rgba(255,255,255,.1),0 20px 45px rgba(0,0,0,.25),0 0 28px rgba(0,140,255,.08);

}

.incomeHubOption:active{

    transform:translateY(-1px) scale(.99);

}

.incomeHubOptionIcon{

    position:relative;

    z-index:1;

    flex:0 0 54px;

    width:54px;

    height:54px;

    border-radius:18px;

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:25px;

    background:rgba(255,255,255,.07);

    border:1px solid rgba(255,255,255,.12);

    box-shadow:inset 0 1px rgba(255,255,255,.1),0 8px 22px rgba(0,0,0,.16);

}

.incomeHubOptionText{

    position:relative;

    z-index:1;

    display:flex;

    flex-direction:column;

    gap:6px;

    min-width:0;

}

.incomeHubOptionText strong{

    font-size:15px;

    color:#f0f7fc;

}

.incomeHubOptionText small{

    color:#7f9bb0;

    font-size:10px;

}

.incomeHubArrow{

    position:relative;

    z-index:1;

    margin-right:auto;

    color:#6ec8ff;

    font-size:20px;

    transition:.22s;

}

.incomeHubOption:hover .incomeHubArrow{

    transform:translateX(-5px);

}

.incomeDetailPanel{

    display:none !important;

    opacity:0;

    transform:translateX(34px);

}

.incomeDetailPanel.incomeDetailOpen{

    display:block !important;

    opacity:1;

    transform:translateX(0);

    animation:incomePanelIn .46s cubic-bezier(.22,.8,.2,1) both;

}

.totalIncomeBubbleWrap{

    padding-top:18px;

    padding-bottom:26px;

}

@keyframes incomePanelIn{

    from{opacity:0;transform:translateY(10px);}

    to{opacity:1;transform:translateY(0);}

}

.incomeBackWrap{

    display:flex;

    justify-content:center;

    padding-top:4px;

}

.incomeBackButton{

    border:1px solid rgba(255,255,255,.11);

    background:rgba(255,255,255,.045);

    color:#8da8ba;

    padding:10px 18px;

    border-radius:13px;

    cursor:pointer;

    transition:.22s;

}

.incomeBackButton:hover{

    transform:translateY(-2px);

    color:#dcecf7;

    border-color:rgba(110,200,255,.28);

    background:rgba(0,140,255,.08);

}

.chartIncomeTotalAction{

    display:flex;

    justify-content:center;

    align-items:center;

    margin-top:18px;

    padding:0 0 4px;

}

.chartIncomeTotalAction .incomeHubOption{

    width:min(310px,88%);

    min-height:58px;

    padding:11px 15px;

    border-radius:17px;

    gap:10px;

}

.chartIncomeTotalAction .incomeHubOptionIcon{

    flex:0 0 38px;

    width:38px;

    height:38px;

    border-radius:12px;

    font-size:18px;

}

.chartIncomeTotalAction .incomeHubOptionText{

    gap:2px;

}

.chartIncomeTotalAction .incomeHubOptionText strong{

    font-size:13px;

}

.chartIncomeTotalAction .incomeHubOptionText small{

    font-size:9px;

}

/* =========================

   Real Chart

========================= */

.chartPanel{

    scroll-margin-top:20px;

}

.realChart{

    position:relative;

    width:100%;

    height:360px;

    padding:20px 10px 10px;

}

.chartBars{

    direction:ltr;

    height:290px;

    display:flex;

    align-items:flex-end;

    gap:12px;

    overflow-x:auto;

    overflow-y:hidden;

    padding:15px 10px 0;

}

.chartBars::-webkit-scrollbar{

    height:5px;

}

.chartBars::-webkit-scrollbar-track{

    background:rgba(255,255,255,.03);

    border-radius:10px;

}

.chartBars::-webkit-scrollbar-thumb{

    background:rgba(0,140,255,.25);

    border-radius:10px;

}

.chartBarItem{

    direction:rtl;

    min-width:55px;

    height:100%;

    display:flex;

    flex-direction:column;

    justify-content:flex-end;

    align-items:center;

    gap:7px;

}

.chartBarItem.currentDay .chartBar{

    box-shadow:0 0 28px rgba(0,190,255,.28),inset 0 0 18px rgba(255,255,255,.1);

}

.chartBarItem.currentDay .chartBarLabel{

    color:#8edcff;

    font-weight:700;

}

.chartBarValue{

    color:#72c4ff;

    font-size:9px;

    white-space:nowrap;

}

.chartBar{

    position:relative;

    width:34px;

    min-height:5px;

    border-radius:10px 10px 5px 5px;

    background:linear-gradient(

        to top,

        #005cff,

        #24aaff

    );

    box-shadow:

        0 0 18px rgba(0,140,255,.25),

        inset 0 1px rgba(255,255,255,.25);

    transition:.35s;

}

.chartBar:hover{

    transform:scaleX(1.12);

    box-shadow:

        0 0 28px rgba(0,140,255,.5),

        inset 0 1px rgba(255,255,255,.35);

}

.chartBarLabel{

    color:#718ba0;

    font-size:9px;

    white-space:nowrap;

}

.chartEmpty{

    width:100%;

    height:100%;

    display:flex;

    align-items:center;

    justify-content:center;

    color:#60798d;

    font-size:12px;

}

.chartSummary{

    display:flex;

    justify-content:center;

    gap:12px;

    flex-wrap:wrap;

    margin-top:8px;

}

.chartSummaryItem{

    padding:9px 14px;

    border-radius:11px;

    background:rgba(255,255,255,.035);

    border:1px solid rgba(255,255,255,.07);

    color:#7891a6;

    font-size:10px;

}

.chartSummaryItem strong{

    color:#63baff;

    margin-right:5px;

}

/* =========================

   Filters

========================= */

.filterArea{

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:15px;

    margin-bottom:18px;

    flex-wrap:wrap;

}

.filters{

    display:flex;

    flex-wrap:wrap;

    gap:9px;

}

.filters button{

    border:1px solid rgba(0,140,255,.2);

    background:rgba(0,100,255,.05);

    color:#8fcaff;

    padding:10px 16px;

    border-radius:11px;

    cursor:pointer;

    transition:.25s;

    font-family:inherit;

}

.filters button:hover,

.filters button.active{

    background:rgba(0,130,255,.16);

    border-color:#168cff;

    box-shadow:0 0 18px rgba(0,140,255,.08);

}

.searchBox{

    min-width:230px;

}

.searchBox input{

    width:100%;

    border:1px solid rgba(255,255,255,.09);

    outline:none;

    background:rgba(255,255,255,.04);

    color:#fff;

    padding:11px 14px;

    border-radius:12px;

    font-family:inherit;

}

.searchBox input:focus{

    border-color:rgba(0,140,255,.5);

    box-shadow:0 0 20px rgba(0,140,255,.06);

}

/* =========================

   Table

========================= */

.tableWrap{

    overflow-x:auto;

    overflow-y:auto;

    max-height:560px;

    -webkit-overflow-scrolling:touch;

    scrollbar-width:thin;

}

table{

    width:100%;

    border-collapse:collapse;

    min-width:750px;

}

th,

td{

    padding:15px 12px;

    border-bottom:1px solid rgba(255,255,255,.06);

    text-align:right;

    font-size:13px;

}

th{

    color:#6f91ae;

    font-weight:normal;

}

td{

    color:#dcecff;

}

tbody tr{

    transition:.25s;

}

tbody tr:hover{

    background:rgba(0,140,255,.035);

}

.amount{

    color:#48adff;

    font-weight:bold;

}

.method{

    display:inline-block;

    padding:5px 9px;

    border-radius:8px;

    background:rgba(0,140,255,.08);

    color:#71bdff;

    font-size:11px;

}

.method.cash{

    color:#6ee7b7;

    background:rgba(16,185,129,.08);

}

.method.card{

    color:#d0a8ff;

    background:rgba(139,92,246,.08);

}

.method.transfer{

    color:#ffca70;

    background:rgba(245,158,11,.08);

}

.method.withdrawal{

    color:#ff8b8b;

    background:rgba(239,68,68,.10);

    border:1px solid rgba(239,68,68,.18);

    box-shadow:0 0 16px rgba(239,68,68,.05);

}

.amount.withdrawalAmount{

    color:#ff5f5f !important;

    font-weight:700;

}

/* =========================

   Empty

========================= */

.empty{

    text-align:center;

    padding:50px 20px;

    color:#647789;

}

.emptyIcon{

    font-size:38px;

    margin-bottom:15px;

}

/* =========================

   Notes

========================= */

.noteForm{

    display:grid;

    grid-template-columns:1fr auto;

    gap:10px;

    margin-bottom:20px;

}

.noteForm textarea{

    width:100%;

    min-height:85px;

    resize:vertical;

    border:1px solid rgba(255,255,255,.09);

    background:rgba(255,255,255,.035);

    color:#fff;

    outline:none;

    border-radius:15px;

    padding:13px;

    font-family:inherit;

    line-height:1.8;

}

.noteForm textarea:focus{

    border-color:rgba(0,140,255,.45);

    box-shadow:0 0 20px rgba(0,140,255,.05);

}

.noteAdd{

    align-self:stretch;

    min-width:115px;

    border:none;

    border-radius:15px;

    cursor:pointer;

    color:#fff;

    background:linear-gradient(

        135deg,

        #007bff,

        #0052cc

    );

    box-shadow:0 10px 30px rgba(0,110,255,.15);

    font-family:inherit;

    transition:.3s;

}

.noteAdd:hover{

    transform:translateY(-3px);

    box-shadow:0 15px 35px rgba(0,110,255,.25);

}

.notes{

    display:grid;

    grid-template-columns:repeat(3,1fr);

    gap:15px;

}

.note{

    position:relative;

    padding:18px;

    border-radius:18px;

    background:rgba(255,255,255,.035);

    border:1px solid rgba(255,255,255,.07);

    min-height:145px;

    transition:.3s;

    overflow:hidden;

}

.note:hover{

    transform:translateY(-5px);

    border-color:rgba(0,140,255,.28);

    box-shadow:0 15px 40px rgba(0,0,0,.25);

}

.note.pinned{

    border-color:rgba(0,140,255,.5);

    box-shadow:

        0 15px 40px rgba(0,0,0,.3),

        0 0 25px rgba(0,140,255,.08);

}

.note.done{

    opacity:.72;

    border-color:rgba(34,197,94,.55);

    box-shadow:

        0 10px 30px rgba(0,0,0,.25),

        0 0 20px rgba(34,197,94,.08);

}

.note.done .noteText{

    text-decoration:line-through;

    color:#8ba996;

}

.pinBadge{

    position:absolute;

    top:10px;

    left:10px;

    font-size:13px;

}

.noteText{

    color:#c8d9e8;

    line-height:1.9;

    font-size:13px;

    padding-left:15px;

    word-break:break-word;

}

.noteDate{

    margin-top:13px;

    color:#5d7891;

    font-size:10px;

}

.noteActions{

    display:flex;

    gap:6px;

    margin-top:14px;

    flex-wrap:wrap;

}

.noteActions button{

    border:1px solid rgba(255,255,255,.08);

    background:rgba(255,255,255,.04);

    color:#8ca5ba;

    padding:7px 9px;

    border-radius:9px;

    cursor:pointer;

    font-family:inherit;

    font-size:10px;

    transition:.2s;

}

.noteActions button:hover{

    border-color:rgba(0,140,255,.35);

    color:#fff;

    background:rgba(0,140,255,.08);

}

.noteActions .doneBtn.doneActive{

    color:#8ff0b5;

    background:rgba(34,197,94,.14);

    border-color:rgba(34,197,94,.55);

    box-shadow:0 0 15px rgba(34,197,94,.08);

}

.noteActions .doneBtn.doneActive:hover{

    background:rgba(34,197,94,.2);

    border-color:#22c55e;

}

.noteActions .delete:hover{

    border-color:rgba(255,70,70,.4);

    color:#ff8888;

}

.noteActions .edit:hover{

    border-color:rgba(255,190,60,.4);

    color:#ffd27a;

}

.noteActions .pinActive{

    color:#7cc8ff;

    border-color:rgba(0,140,255,.4);

    background:rgba(0,140,255,.09);

}

/* =========================

   Toast

========================= */

.toast{

    position:fixed;

    left:50%;

    bottom:25px;

    transform:translate(-50%,30px);

    opacity:0;

    pointer-events:none;

    z-index:10000;

    padding:13px 20px;

    border-radius:13px;

    background:rgba(5,15,25,.9);

    border:1px solid rgba(0,140,255,.3);

    color:#dcecff;

    box-shadow:0 15px 45px rgba(0,0,0,.45);

    backdrop-filter:blur(20px);

    transition:.35s;

    font-size:12px;

}

.toast.show{

    opacity:1;

    transform:translate(-50%,0);

}

/* =========================

   Mobile Bottom Navigation

========================= */

.mobileNav{

    display:none;

}

/* =========================

   Responsive

========================= */

@media(max-width:1100px){

    .stats{

        grid-template-columns:repeat(3,1fr);

    }

}

@media(max-width:900px){

    .stats{

        grid-template-columns:repeat(2,1fr);

    }

    .notes{

        grid-template-columns:1fr 1fr;

    }

}

@media(max-width:600px){

    body{

        padding-bottom:105px;

    }

    .container{

        width:92%;

        padding-top:22px;

        padding-bottom:30px;

    }

    .header{

        align-items:flex-start;

        margin-bottom:20px;

    }

    .title h1{

        font-size:22px;

    }

    .title p{

        font-size:11px;

    }

    .headerActions{

        flex-direction:column;

        gap:7px;

    }

    .back,

    .printBtn{

        font-size:10px;

        padding:9px 11px;

        white-space:nowrap;

    }

    .stats{

        grid-template-columns:1fr 1fr;

        gap:9px;

    }

    .stat{

        min-height:105px;

        padding:15px;

        border-radius:18px;

    }

    .stat strong{

        font-size:17px;

        margin-top:13px;

    }

    .stat small{

        font-size:10px;

    }

    .statIcon{

        font-size:20px;

        left:12px;

        top:12px;

    }

    .panel{

        padding:17px;

        border-radius:21px;

        margin-bottom:16px;

    }

    .panelTitle h2{

        font-size:16px;

    }

    .panelTitle span{

        font-size:9px;

    }

    .chartWrap{

        min-height:270px;

    }

    .incomeBubble{

        width:205px;

        height:205px;

    }

    .bubbleAmount{

        font-size:18px;

    }

    .realChart{

        height:320px;

    }

    .chartBars{

        height:250px;

        gap:7px;

    }

    .chartBarItem{

        min-width:48px;

    }

    .chartBar{

        width:28px;

    }

    .incomeHubOptions{

        grid-template-columns:1fr;

        gap:11px;

    }

    .incomeHubOption{

        min-height:82px;

        padding:15px;

        border-radius:19px;

    }

    .incomeHubOptionIcon{

        flex-basis:48px;

        width:48px;

        height:48px;

        border-radius:15px;

        font-size:22px;

    }

    .incomeHubOptionText strong{

        font-size:13px;

    }

    .incomeHubOptionText small{

        font-size:9px;

    }

    .filterArea{

        align-items:stretch;

    }

    .filters{

        width:100%;

        overflow-x:auto;

        flex-wrap:nowrap;

        padding-bottom:3px;

    }

    .filters button{

        flex:none;

        font-size:10px;

        padding:9px 13px;

    }

    .searchBox{

        width:100%;

        min-width:0;

    }

     .tableWrap{

        overflow-x:auto;

        overflow-y:auto;

        max-height:62vh;

        -webkit-overflow-scrolling:touch;

    }

    table{

        min-width:0;

        width:100%;

    }

    table thead{

        display:none;

    }

    table,

    tbody,

    tr,

    td{

        display:block;

        width:100%;

    }

    tbody tr{

        position:relative;

        margin-bottom:12px;

        padding:13px;

        border:1px solid rgba(255,255,255,.07);

        border-radius:17px;

        background:rgba(255,255,255,.035);

    }

    tbody tr:hover{

        background:rgba(0,140,255,.04);

    }

    td{

        border:none;

        padding:6px 0;

        font-size:11px;

        display:flex;

        justify-content:space-between;

        gap:10px;

    }

    td::before{

        color:#60788d;

        font-size:9px;

    }

    td:nth-child(1)::before{content:"تاریخ";}

    td:nth-child(2)::before{content:"ساعت";}

    td:nth-child(3)::before{content:"مشتری";}

    td:nth-child(4)::before{content:"خدمت";}

    td:nth-child(5)::before{content:"مبلغ";}

    td:nth-child(6)::before{content:"پرداخت";}

    td:nth-child(7)::before{content:"توضیحات";}

    td:first-child{

        padding-top:0;

    }

    .amount{

        font-size:12px;

    }

    .empty{

        padding:35px 10px;

        font-size:11px;

    }

    .notes{

        grid-template-columns:1fr;

    }

    .noteForm{

        grid-template-columns:1fr;

    }

    .noteAdd{

        min-height:46px;

    }

    .note{

        min-height:135px;

    }

    .mobileNav{

        position:fixed;

        display:flex;

        align-items:center;

        justify-content:space-around;

        gap:5px;

        left:10px;

        right:10px;

        bottom:12px;

        z-index:9000;

        padding:8px 7px;

        border-radius:22px;

        background:rgba(5,12,20,.72);

        border:1px solid rgba(255,255,255,.1);

        backdrop-filter:blur(28px);

        -webkit-backdrop-filter:blur(28px);

        box-shadow:

            0 20px 50px rgba(0,0,0,.55),

            0 0 30px rgba(0,100,255,.06),

            inset 0 1px rgba(255,255,255,.06);

    }

    .mobileNav a{

        flex:1;

        min-width:0;

        text-decoration:none;

        color:#688096;

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        gap:4px;

        padding:7px 3px;

        border-radius:15px;

        font-size:8px;

        transition:.25s;

    }

    .mobileNav a span{

        font-size:17px;

        line-height:1;

    }

    .mobileNav a.active{

        color:#64baff;

        background:rgba(0,130,255,.1);

        box-shadow:

            0 0 20px rgba(0,140,255,.08),

            inset 0 0 15px rgba(0,140,255,.04);

    }

    .mobileNav a:active{

        transform:scale(.92);

    }

    .mouseGlow,

    .cursorDot{

        display:none;

    }

}

@media(max-width:360px){

    .container{

        width:94%;

    }

    .title h1{

        font-size:19px;

    }

    .stat strong{

        font-size:15px;

    }

    .mobileNav a{

        font-size:7px;

    }

    .mobileNav a span{

        font-size:15px;

    }

}

/* =========================

   PRINT / EXCEL STYLE

========================= */

/* =========================

   NOTE MODALS

========================= */

.noteModal{position:fixed;inset:0;z-index:13000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(3,8,15,.58);backdrop-filter:blur(18px) saturate(135%);-webkit-backdrop-filter:blur(18px) saturate(135%)}

.noteModal.open{display:flex;animation:modalFade .22s ease}

.noteModalCard{position:relative;width:min(560px,94vw);max-height:min(760px,90vh);overflow:auto;background:linear-gradient(145deg,rgba(255,255,255,.105),rgba(255,255,255,.035) 48%,rgba(0,10,22,.28));border:1px solid rgba(255,255,255,.18);border-top-color:rgba(255,255,255,.30);border-radius:28px;padding:25px;box-shadow:0 35px 100px rgba(0,0,0,.72),0 0 55px rgba(0,140,255,.12),inset 0 1px rgba(255,255,255,.16),inset 0 -1px rgba(0,0,0,.18);backdrop-filter:blur(38px) saturate(150%);-webkit-backdrop-filter:blur(38px) saturate(150%);animation:modalUp .25s ease}

.noteModalClose{position:absolute;top:12px;left:12px;z-index:2;width:38px;height:38px;border:1px solid rgba(255,255,255,.16);border-radius:50%;background:rgba(255,255,255,.07);color:#d9e8f2;font-size:25px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.22s;box-shadow:inset 0 1px rgba(255,255,255,.08),0 8px 24px rgba(0,0,0,.18)}

.noteModalClose:hover{transform:rotate(90deg) scale(1.06);background:rgba(255,75,75,.16);border-color:rgba(255,120,120,.42);color:#fff;box-shadow:0 0 24px rgba(255,80,80,.15)}

.noteModalClose:active{transform:scale(.94)}

.noteModalCard:before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(120deg,rgba(255,255,255,.10),transparent 35%,transparent 70%,rgba(0,140,255,.06));}

.noteModalTitle{position:relative;font-size:18px;font-weight:800;color:#eef7ff;margin-bottom:9px}

.noteModalText{position:relative;color:#9bb1c2;font-size:12px;line-height:2;margin-bottom:17px}

.noteModalTextarea{position:relative;box-sizing:border-box;width:100%;min-height:170px;resize:vertical;border:1px solid rgba(255,255,255,.14);outline:none;border-radius:18px;background:rgba(255,255,255,.075);color:#fff;padding:15px;font-family:inherit;font-size:14px;line-height:2;box-shadow:inset 0 1px rgba(255,255,255,.06),0 8px 30px rgba(0,0,0,.12)}

.noteModalTextarea:focus{border-color:rgba(90,180,255,.65);background:rgba(255,255,255,.09);box-shadow:0 0 28px rgba(0,140,255,.12),inset 0 1px rgba(255,255,255,.08)}

.noteModalActions{position:relative;display:flex;justify-content:flex-end;gap:10px;margin-top:17px}

.noteModalActions button{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:#c3d3df;border-radius:14px;padding:11px 17px;cursor:pointer;font-family:inherit;font-weight:600;transition:.22s;box-shadow:inset 0 1px rgba(255,255,255,.07)}

.noteModalActions button:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.11);color:#fff}

.noteModalActions button:disabled{opacity:.55;cursor:not-allowed;transform:none}

.noteModalActions .danger{background:linear-gradient(135deg,rgba(255,65,65,.20),rgba(130,15,25,.16));border-color:rgba(255,100,100,.32);color:#ffb0b0}

.noteModalActions .danger:hover{background:linear-gradient(135deg,rgba(255,65,65,.30),rgba(130,15,25,.24));border-color:rgba(255,120,120,.48)}

.noteModalActions .primary{background:linear-gradient(135deg,rgba(0,123,255,.82),rgba(0,82,204,.78));border-color:rgba(100,190,255,.45);color:#fff}

@media(max-width:600px){.noteModal{padding:12px}.noteModalCard{width:100%;padding:20px;border-radius:23px}.noteModalActions{flex-direction:column}.noteModalActions button{width:100%}}

.eyeIcon{width:20px;height:13px;border:2px solid currentColor;border-radius:75% 25% 75% 25%/70% 30% 70% 30%;display:inline-block;transform:rotate(-45deg);position:relative;vertical-align:middle;margin-left:7px}

.eyeIcon:after{content:"";position:absolute;width:5px;height:5px;border-radius:50%;background:currentColor;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg)}

.globalMoneyEye.isHidden .eyeIcon{opacity:.8}

.globalMoneyEye.isHidden .eyeIcon:before{content:"";position:absolute;width:24px;height:2px;background:currentColor;left:-4px;top:4px;transform:rotate(45deg);border-radius:4px}

@keyframes modalFade{from{opacity:0}to{opacity:1}}

@keyframes modalUp{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}

@media(max-width:600px){

    .incomeHubOptions .incomeHubOption,

    .chartIncomeTotalAction .incomeHubOption{

        width:min(300px,90vw);

    }

}

@media print{

    @page{

        size:A4 landscape;

        margin:10mm;

    }

    body{

        background:#fff!important;

        color:#000!important;

        font-family:Arial,Tahoma,sans-serif;

        padding:0;

    }

    body::before,

    body::after,

    .mouseGlow,

    .cursorDot,

    .headerActions,

    .filters,

    .searchBox,

    .noteForm,

    .noteActions,

    .mobileNav,

    .incomeHubPanel,

    .chartWrap,

    .chartButtonWrap,

    .chartPanel{

        display:none!important;

    }

    .container{

        width:100%;

        padding:0;

    }

    .title{

        margin-bottom:12px;

    }

    .title h1{

        color:#000!important;

        font-size:22px;

    }

    .title p{

        color:#555!important;

    }

    .stats{

        display:grid;

        grid-template-columns:repeat(5,1fr);

        gap:8px;

        margin-bottom:15px;

    }

    .stat{

        min-height:75px;

        padding:10px;

        border-radius:5px;

        background:#fff!important;

        color:#000!important;

        border:1px solid #999!important;

        box-shadow:none!important;

        backdrop-filter:none!important;

    }

    .stat::after,

    .statIcon{

        display:none;

    }

    .stat small{

        color:#444!important;

        font-size:9px;

    }

    .stat strong{

        color:#000!important;

        font-size:13px;

        margin-top:7px;

    }

    .panel{

        background:#fff!important;

        color:#000!important;

        border:1px solid #888!important;

        border-radius:5px;

        padding:12px;

        box-shadow:none!important;

        backdrop-filter:none!important;

        margin-bottom:12px;

    }

    .panel::before{

        display:none;

    }

    .panelTitle h2{

        color:#000!important;

        font-size:14px;

    }

    .panelTitle span{

        color:#555!important;

        font-size:9px;

    }

    table{

        min-width:0!important;

        width:100%!important;

        border-collapse:collapse!important;

        background:#fff!important;

    }

    thead{

        display:table-header-group!important;

    }

    tbody{

        display:table-row-group!important;

    }

    tr{

        display:table-row!important;

        background:#fff!important;

        page-break-inside:avoid;

    }

    th{

        display:table-cell!important;

        background:#e9edf2!important;

        color:#000!important;

        border:1px solid #999!important;

        padding:8px 7px!important;

        font-weight:bold!important;

        font-size:10px!important;

        text-align:center!important;

    }

    td{

        display:table-cell!important;

        color:#000!important;

        background:#fff!important;

        border:1px solid #bbb!important;

        padding:7px!important;

        font-size:10px!important;

        text-align:right!important;

    }

    td::before{

        display:none!important;

        content:none!important;

    }

    .amount{

        color:#000!important;

        font-weight:bold;

    }

    .method{

        background:#fff!important;

        color:#000!important;

        padding:0!important;

    }

    .note{

        background:#fff!important;

        color:#000!important;

        border:1px solid #aaa!important;

        box-shadow:none!important;

        border-radius:5px;

        page-break-inside:avoid;

    }

    .noteText{

        color:#000!important;

    }

    .noteDate{

        color:#555!important;

    }

}

/* =========================

   REPORT TITLE / CARD HOVER / MINI CHAT / PAYMENT STATUS

========================= */

.reportTitleCard{

    display:inline-flex;

    align-items:center;

    gap:8px;

    padding:12px 18px;

    border:1px solid rgba(0,140,255,.20);

    border-radius:16px;

    background:linear-gradient(145deg,rgba(0,120,255,.10),rgba(255,255,255,.045));

    box-shadow:inset 0 1px rgba(255,255,255,.07),0 10px 30px rgba(0,0,0,.22);

    transition:.3s;

}

.reportTitleCard:hover{

    transform:translateY(-3px);

    border-color:rgba(0,156,255,.65);

    box-shadow:0 0 32px rgba(0,140,255,.20),inset 0 1px rgba(255,255,255,.10);

}

.stat,.panel,.note{transition:.32s ease,box-shadow .32s ease,border-color .32s ease,transform .32s ease}

.stat:hover,.panel:hover,.note:hover{

    transform:translateY(-3px);

    border-color:rgba(0,150,255,.40);

    box-shadow:0 25px 70px rgba(0,0,0,.42),0 0 34px rgba(0,140,255,.10),inset 0 1px rgba(255,255,255,.08);

}

    position:relative;

    z-index:6;

    display:flex;

    align-items:center;

    gap:14px;

    margin:-6px 0 22px;

    padding:10px 12px;

    min-height:58px;

    border:1px solid rgba(0,140,255,.15);

    border-radius:18px;

    background:linear-gradient(135deg,rgba(255,255,255,.045),rgba(0,110,255,.045));

    backdrop-filter:blur(22px);

    -webkit-backdrop-filter:blur(22px);

    box-shadow:inset 0 1px rgba(255,255,255,.06),0 14px 40px rgba(0,0,0,.20);

}

.miniChatHead{display:flex;align-items:center;gap:10px;white-space:nowrap;font-size:11px;color:#9dc9ee}

.miniChatHead button{border:1px solid rgba(0,140,255,.24);background:rgba(0,120,255,.08);color:#76c2ff;border-radius:10px;padding:7px 10px;font:inherit;cursor:pointer;transition:.25s}

.miniChatHead button:hover{background:rgba(0,140,255,.16);box-shadow:0 0 18px rgba(0,140,255,.12)}

.miniChatItems{display:flex;align-items:center;gap:8px;min-width:0;overflow-x:auto;scrollbar-width:thin;flex:1}

.miniChatItems::-webkit-scrollbar{height:4px}.miniChatItems::-webkit-scrollbar-thumb{background:rgba(0,140,255,.25);border-radius:10px}

.miniChatItem{flex:0 0 auto;max-width:280px;padding:8px 11px;border-radius:12px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.035);color:#a9bed0;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}

.miniChatItem.unread{border-color:rgba(0,140,255,.30);background:rgba(0,120,255,.08);color:#cceaff}

.miniChatEmpty{color:#61788d;font-size:10px}

.paymentStatus{display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:9px;font-size:10px;white-space:nowrap}

.paymentStatus.paid{color:#8ff0b5;background:rgba(34,197,94,.09);border:1px solid rgba(34,197,94,.18)}

.paymentStatus.pending{color:#ffd28b;background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.18)}

.paymentStatus.none{color:#6e8599;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)}

.liveDateTime{

    margin-top:10px;

    display:inline-flex;

    align-items:center;

    gap:8px;

    padding:8px 13px;

    border:1px solid rgba(0,140,255,.20);

    border-radius:13px;

    background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(0,110,255,.07));

    color:#8fcfff;

    font-size:11px;

    direction:rtl;

    backdrop-filter:blur(16px);

    -webkit-backdrop-filter:blur(16px);

    box-shadow:inset 0 1px rgba(255,255,255,.06),0 0 22px rgba(0,120,255,.05);

    white-space:nowrap;

}

.globalMoneyEye{

    border:1px solid rgba(0,140,255,.24);

    background:rgba(0,110,255,.08);

    color:#8fcfff;

    min-height:42px;

    padding:0 15px;

    border-radius:13px;

    cursor:pointer;

    font-family:inherit;

    transition:.25s;

    box-shadow:inset 0 1px rgba(255,255,255,.06);

}

.globalMoneyEye:hover{

    background:rgba(0,140,255,.16);

    border-color:rgba(0,160,255,.45);

    box-shadow:0 0 25px rgba(0,140,255,.16);

    transform:translateY(-2px);

}

/* =========================

   NEW FLOATING CONTROLS / CHAT / PAYMENT

========================= */

.moneyRow{display:flex;align-items:center;gap:8px;position:relative;z-index:3}

.moneyEye{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);color:#7fc7ff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-family:inherit;transition:.25s;display:inline-flex;align-items:center;justify-content:center}

.moneyEye:hover{background:rgba(0,140,255,.12);border-color:rgba(0,140,255,.35);transform:scale(1.06)}

.floatingTop,.floatingChat{position:fixed;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9500;color:#8ed1ff;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(0,100,255,.10));border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);box-shadow:0 18px 45px rgba(0,0,0,.45),inset 0 1px rgba(255,255,255,.08);transition:.3s;font-size:24px}

.floatingTop{left:22px;bottom:28px;opacity:0;pointer-events:none;transform:translateY(15px)}

.floatingTop.show{opacity:1;pointer-events:auto;transform:translateY(0)}

.floatingChat{right:22px;bottom:28px;font-size:25px}

.floatingTop:hover,.floatingChat:hover{transform:translateY(-5px) scale(1.05);border-color:rgba(0,140,255,.5);box-shadow:0 22px 55px rgba(0,0,0,.55),0 0 28px rgba(0,140,255,.13)}

.chatOverlay,.paymentOverlay{position:fixed;inset:0;background:rgba(0,0,0,.52);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);z-index:12000;display:none;align-items:center;justify-content:center;padding:20px}

.chatOverlay.open,.paymentOverlay.open{display:flex}

.chatWindow{width:min(900px,95vw);height:min(570px,78vh);display:flex;flex-direction:column;background:linear-gradient(145deg,rgba(8,20,32,.88),rgba(2,8,14,.92));border:1px solid rgba(255,255,255,.12);border-radius:25px;box-shadow:0 35px 100px rgba(0,0,0,.7),inset 0 1px rgba(255,255,255,.07);backdrop-filter:blur(30px);overflow:hidden}

.chatHeader{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.07)}

.chatHeader h3{font-size:16px}.chatHeader small{display:block;color:#6d8ba5;font-size:10px;margin-top:4px}.chatClose,.paymentClose{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#9ab4ca;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:.22s;box-shadow:inset 0 1px rgba(255,255,255,.06),0 8px 22px rgba(0,0,0,.16)}.chatClose:hover,.paymentClose:hover{transform:rotate(90deg) scale(1.08);background:rgba(255,75,75,.16);border-color:rgba(255,120,120,.42);color:#fff;box-shadow:0 0 24px rgba(255,80,80,.15)}.chatClose:active,.paymentClose:active{transform:scale(.94)}

.chatMessages{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px}.chatMessages::-webkit-scrollbar{width:5px}.chatMessages::-webkit-scrollbar-thumb{background:rgba(0,140,255,.25);border-radius:10px}

.chatMsg{max-width:min(72%,520px);padding:11px 14px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);backdrop-filter:blur(16px);border-radius:18px;box-shadow:0 10px 25px rgba(0,0,0,.16);line-height:1.8;font-size:12px;word-break:break-word}.chatMsg.out{align-self:flex-end;border-bottom-right-radius:6px;background:rgba(0,120,255,.10);border-color:rgba(0,140,255,.22)}.chatMsg.in{align-self:flex-start;border-bottom-left-radius:6px}.chatMeta{display:flex;gap:8px;color:#5e7890;font-size:9px;margin-top:5px}.chatUnread{color:#71c2ff}

.chatComposer{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.07)}.chatComposer textarea{flex:1;min-height:48px;max-height:110px;resize:none;border:1px solid rgba(255,255,255,.09);outline:none;border-radius:15px;background:rgba(255,255,255,.035);color:#fff;padding:11px;font-family:inherit}.chatSend{width:95px;border:0;border-radius:14px;background:linear-gradient(135deg,#007bff,#0052cc);color:#fff;font-family:inherit;cursor:pointer}

.paymentCard{width:min(480px,92vw);background:linear-gradient(145deg,rgba(11,28,43,.91),rgba(2,9,16,.94));border:1px solid rgba(255,255,255,.15);border-radius:25px;padding:24px;box-shadow:0 35px 100px rgba(0,0,0,.7),0 0 40px rgba(0,140,255,.08);backdrop-filter:blur(30px)}.paymentTop{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}.paymentTitle{font-size:18px}.paymentSub{font-size:10px;color:#6d8aa1;margin-top:5px}.paymentInfo{display:grid;gap:9px}.paymentInfoRow{display:flex;justify-content:space-between;gap:15px;padding:11px 13px;border-radius:13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}.paymentInfoRow span:first-child{color:#6d879e;font-size:10px}.paymentInfoRow span:last-child{color:#dcecff;font-size:12px;text-align:left}.paymentAmount{color:#63bdff!important;font-weight:bold}.paymentActions{display:flex;gap:9px;margin-top:16px}.payConfirm{flex:1;border:1px solid rgba(34,197,94,.3);background:rgba(34,197,94,.10);color:#8ff0b5;padding:12px;border-radius:14px;cursor:pointer;font-family:inherit}.payConfirm:hover{background:rgba(34,197,94,.18)}.payDismiss{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);color:#91a8ba;padding:12px 18px;border-radius:14px;cursor:pointer;font-family:inherit}

 .paymentOverlay.open{animation:paymentOverlayIn .18s ease both}

.paymentOverlay.open .paymentCard{animation:paymentCardIn .24s cubic-bezier(.2,.8,.2,1) both}

@keyframes paymentOverlayIn{from{opacity:0}to{opacity:1}}

@keyframes paymentCardIn{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}

@media(max-width:600px){.reportTitleCard{font-size:21px;padding:10px 13px}.miniChatBar{align-items:stretch;flex-direction:column;gap:8px;padding:9px}.miniChatHead{justify-content:space-between}.miniChatItems{width:100%;padding-bottom:2px}.miniChatItem{max-width:220px}.floatingTop,.floatingChat{width:50px;height:50px;bottom:88px}.floatingTop{left:14px}.floatingChat{right:14px}.chatOverlay,.paymentOverlay{padding:10px}.chatWindow{width:96vw;height:82vh;border-radius:20px}.chatMsg{max-width:84%}.chatComposer{flex-direction:row}.chatSend{width:78px}.paymentCard{padding:18px}.paymentInfoRow span:last-child{max-width:62%}}

@media print{.floatingTop,.floatingChat,.chatOverlay,.paymentOverlay{display:none!important}}

@media (max-width:600px){

    .cashWithdrawalCard{padding:21px 17px;border-radius:23px}

    .cashWithdrawalTitle{font-size:16px}

    .cashWithdrawalActions{flex-direction:column}

    .cashCancelBtn{order:2}

    .cashWithdrawBtn{order:1}

    .cashHistoryDesc{max-width:190px}

}


/* ===== Monthly report controls ===== */
.monthlyReportNavigator{
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:18px;
    margin:0 0 18px;
    min-height:62px;
    z-index:20;
}
.monthNavButton{
    position:fixed;
    top:50%;
    transform:translateY(-50%);
    width:48px;
    height:48px;
    border-radius:50%;
    border:1px solid rgba(0,140,255,.28);
    background:rgba(5,18,30,.78);
    color:#83caff;
    font:700 22px Tahoma,Arial,sans-serif;
    cursor:pointer;
    z-index:10000;
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    box-shadow:0 10px 35px rgba(0,0,0,.35),0 0 24px rgba(0,140,255,.08);
    transition:.25s ease;
}
.monthNavButton:hover:not(:disabled){
    transform:translateY(-50%) scale(1.08);
    border-color:#168cff;
    background:rgba(0,140,255,.14);
    box-shadow:0 0 30px rgba(0,140,255,.22),0 12px 38px rgba(0,0,0,.4);
}
.monthNavButton:disabled{opacity:.25;cursor:not-allowed}
.monthNavPrev{right:18px}
.monthNavNext{left:18px}
.monthNavCenter{
    min-width:min(330px,80vw);
    padding:11px 22px 12px;
    border-radius:18px;
    border:1px solid rgba(110,200,255,.18);
    background:rgba(255,255,255,.045);
    text-align:center;
    box-shadow:inset 0 1px rgba(255,255,255,.06),0 12px 35px rgba(0,0,0,.18);
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:0;
}
.monthNavTitle{display:block;color:#eaf6ff;font-size:15px;font-weight:700}
.monthNavSub{display:block;color:#6f91aa;font-size:10px;margin-top:5px}
.monthResetButton{
    position:static;
    z-index:10001;
    margin-top:9px;
    border:1px solid rgba(255,180,70,.25);
    background:rgba(20,18,12,.82);
    color:#ffd27a;
    border-radius:12px;
    padding:8px 13px;
    font:700 10px Tahoma,Arial,sans-serif;
    cursor:pointer;
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    box-shadow:0 8px 22px rgba(0,0,0,.24),0 0 16px rgba(255,180,70,.06);
    transition:.25s ease;
}
.monthResetButton:hover{transform:translateY(-3px);border-color:rgba(255,190,70,.55);box-shadow:0 0 25px rgba(255,180,70,.12),0 15px 40px rgba(0,0,0,.4)}
.themeToggleButton{
    position:fixed;
    left:24px;
    bottom:24px;
    z-index:10001;
    width:48px;
    height:48px;
    border-radius:50%;
    border:1px solid rgba(110,200,255,.28);
    background:rgba(5,18,30,.82);
    color:#8edcff;
    font-size:20px;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    box-shadow:0 12px 35px rgba(0,0,0,.32),0 0 22px rgba(0,140,255,.08);
    transition:.28s ease;
}
.themeToggleButton:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 0 28px rgba(0,140,255,.18),0 15px 40px rgba(0,0,0,.4)}
.themeToggleButton.rotating{animation:themeRotate .55s cubic-bezier(.2,.8,.2,1)}
@keyframes themeRotate{0%{transform:rotate(0) scale(1)}50%{transform:rotate(180deg) scale(1.12)}100%{transform:rotate(360deg) scale(1)}}

.stats .stat::before{
    content:"";
    position:absolute;
    left:12%;
    right:12%;
    bottom:0;
    height:3px;
    border-radius:999px;
    background:linear-gradient(90deg,transparent,#00c8ff,#7c5cff,#00c8ff,transparent);
    transform:scaleX(0);
    transform-origin:center;
    opacity:0;
    transition:transform .4s ease,opacity .3s ease,filter .3s ease;
    box-shadow:0 0 10px rgba(0,200,255,.65),0 0 24px rgba(124,92,255,.35);
    z-index:4;
}
.stats .stat:hover::before{transform:scaleX(1);opacity:1;filter:brightness(1.35)}

/* Light theme: intentionally additive so the original dark design remains the default. */
body.janaLightTheme{
    background:radial-gradient(circle at 85% 5%,rgba(0,140,255,.10),transparent 30%),radial-gradient(circle at 10% 90%,rgba(0,80,255,.08),transparent 30%),#eef5fb;
    color:#132638;
}
body.janaLightTheme .stat,
body.janaLightTheme .panel,
body.janaLightTheme .monthNavCenter,
body.janaLightTheme .incomeHubOption,
body.janaLightTheme .chartSummaryItem,
body.janaLightTheme .note,
body.janaLightTheme .searchBox input,
body.janaLightTheme .noteForm textarea,
body.janaLightTheme .themeToggleButton,
body.janaLightTheme .monthResetButton,
body.janaLightTheme .monthNavButton{
    background:linear-gradient(145deg,rgba(255,255,255,.88),rgba(240,247,253,.78));
    border-color:rgba(25,100,160,.16);
    color:#17324a;
    box-shadow:0 18px 45px rgba(25,70,110,.10),inset 0 1px rgba(255,255,255,.9);
}
body.janaLightTheme .stat small,
body.janaLightTheme .panelTitle span,
body.janaLightTheme .monthNavSub,
body.janaLightTheme .incomeHubOptionText small,
body.janaLightTheme .noteDate,
body.janaLightTheme td,
body.janaLightTheme th{color:#5b7285}
body.janaLightTheme .panelTitle h2,
body.janaLightTheme .incomeHubOptionText strong,
body.janaLightTheme .monthNavTitle{color:#16364f}
body.janaLightTheme .searchBox input,
body.janaLightTheme .noteForm textarea{color:#183247;background:rgba(255,255,255,.8)}
body.janaLightTheme .monthNavButton:hover:not(:disabled){background:rgba(0,140,255,.10)}

@media(max-width:700px){
    .monthNavButton{width:42px;height:42px;font-size:19px}
    .monthNavPrev{right:8px}.monthNavNext{left:8px}
    .monthNavCenter{min-width:210px;padding:9px 12px}
    .monthNavTitle{font-size:12px}.monthNavSub{font-size:8px}
    .monthResetButton{margin-top:7px;font-size:9px;padding:7px 10px}
    .themeToggleButton{left:12px;bottom:12px;width:43px;height:43px}
}


/* Premium fixed light/dark toggle */
#themeToggleButton{position:fixed!important;top:18px!important;right:22px!important;left:auto!important;bottom:auto!important;z-index:10050!important;width:52px!important;height:52px!important;border-radius:16px!important;border:1px solid rgba(255,255,255,.18)!important;background:rgba(20,24,32,.78)!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;backdrop-filter:blur(16px) saturate(150%)!important;-webkit-backdrop-filter:blur(16px) saturate(150%)!important;box-shadow:0 10px 30px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.12)!important;font-size:22px!important;transition:transform .28s cubic-bezier(.2,.8,.2,1),box-shadow .28s ease,background .28s ease!important;}
#themeToggleButton:hover{transform:translateY(-2px) rotate(12deg)!important;box-shadow:0 14px 38px rgba(0,0,0,.28),0 0 25px rgba(90,190,255,.2)!important}
#themeToggleButton:active{transform:scale(.93) rotate(0)!important}
@media(max-width:700px){#themeToggleButton{top:12px!important;right:12px!important;width:46px!important;height:46px!important;border-radius:14px!important;font-size:20px!important}}

/* اسکرول افقی حرفه‌ای نمودار درآمد */
#chartBars{overflow-x:auto!important;overflow-y:hidden!important;display:flex!important;gap:12px!important;align-items:flex-end!important;justify-content:flex-start!important;scroll-behavior:smooth!important;scrollbar-width:thin;padding:14px 8px 18px!important;touch-action:pan-x;cursor:grab;}
#chartBars:active{cursor:grabbing;}
#chartBars .chartBarItem{flex:0 0 72px!important;min-width:72px!important;}
#chartBars::-webkit-scrollbar{height:7px;}
#chartBars::-webkit-scrollbar-thumb{border-radius:99px;background:rgba(120,120,140,.55);}
#chartBars::-webkit-scrollbar-track{background:rgba(120,120,140,.10);border-radius:99px;}
</style>

</head>

<body>
<button type="button" class="themeToggleButton" id="themeToggleButton" onclick="toggleJanaTheme()" aria-label="تغییر حالت روشن و تاریک" title="تغییر حالت روشن و تاریک">☀️</button>

<div class="mouseGlow" id="mouseGlow"></div>

<div class="cursorDot" id="cursorDot"></div>

<div class="container" id="home">

<header class="header">

<div class="title">

    <h1 class="reportTitleCard">📊  گــــــزارش</h1>

    <p>کافی‌نت جانا • گزارش مالی</p>

    <div class="liveDateTime" id="liveDateTime">📅 در حال بارگذاری... • 🕐 --:--:--</div>

</div>

<div class="headerActions">

    <button class="printBtn" onclick="window.print()">

        🖨 چاپ گزارش

    </button>

    <button class="globalMoneyEye" id="globalMoneyEye" onclick="toggleMoneyVisibility()" aria-label="نمایش یا مخفی کردن همه مبالغ" title="نمایش یا مخفی کردن مبالغ"><span class="eyeIcon" aria-hidden="true"></span><span class="eyeText">نمایش مبالغ</span></button>

    <a href="./index.html" class="back">

        ← صفحه اصلی

    </a>

</div>

</header>

<div class="monthlyReportNavigator" id="monthlyReportNavigator">
    <button type="button" class="monthNavButton monthNavPrev" id="monthPrevButton" onclick="changeReportMonth(-1)" aria-label="ماه قبل">◀</button>
    <div class="monthNavCenter">
        <span class="monthNavTitle" id="selectedReportMonth">ماه جاری</span>
        <span class="monthNavSub" id="selectedReportMonthSub">گزارش بر اساس ماه شمسی</span>
        <button type="button" class="monthResetButton" id="monthResetButton" onclick="resetCurrentReportMonth()">↻ صفر کردن گزارش ماه</button>
    </div>
    <button type="button" class="monthNavButton monthNavNext" id="monthNextButton" onclick="changeReportMonth(1)" aria-label="ماه بعد">▶</button>
</div>

<section class="stats" id="income">

<div class="stat">

    <span class="statIcon">💰</span>

    <small>جمع کل روزانه</small>

    <div class="moneyRow"><strong id="totalIncome">۰ تومان</strong></div>

</div>

<div class="stat">

    <span class="statIcon">🧾</span>

    <small>تعداد تراکنش</small>

    <strong id="transactionCount">۰</strong>

</div>

<div class="stat">

    <span class="statIcon">💳</span>

    <small>کارتخوان</small>

    <div class="moneyRow"><strong id="posTotal">۰</strong></div>

</div>

<div class="stat cashStatCard" id="cashStatCard" onclick="openCashWithdrawal()" role="button" tabindex="0" aria-label="باز کردن فرایند برداشت نقدی" onkeydown="if(event.key==="Enter"||event.key===" "){event.preventDefault();openCashWithdrawal();}">

    <span class="statIcon">💵</span>

    <small>نقدی</small>

    <div class="moneyRow"><strong id="cashTotal">۰</strong></div>

    <span class="cashCardHint">برداشت نقدی</span>

    <span class="cashCardArrow">⌄</span>

</div>

<div class="stat">

    <span class="statIcon">🔄</span>

    <small>کارت‌به‌کارت</small>

    <div class="moneyRow"><strong id="transferTotal">۰</strong></div>

</div>

</section>

<section class="panel incomeHubPanel" id="incomeHub">

<div class="panelTitle">

    <h2>📈 درآمد</h2>

    <span>

        یک گزینه را انتخاب کنید

    </span>

</div>

<div class="chartWrap incomeHubBubbleWrap">

    <div class="incomeBubble">

        <div class="bubbleContent">

            <div class="bubbleIcon">💰</div>

            <div class="bubbleLabel">درآمد کل</div>

            <div class="moneyRow"><div class="bubbleAmount" id="bubbleIncome">۰ تومان</div></div>

        </div>

    </div>

</div>

<div class="incomeHubOptions">

    <button type="button" class="incomeHubOption chartOption" onclick="openChart()">

        <span class="incomeHubOptionIcon">📊</span>

        <span class="incomeHubOptionText">

            <strong>نمودار درآمد</strong>

            <small>نمایش درآمد روزانه در نمودار</small>

        </span>

        <span class="incomeHubArrow">←</span>

    </button>

</div>

</section>

<section class="panel incomeDetailPanel" id="totalIncomeSection">

<div class="panelTitle">

    <h2>💰 درآمد کل</h2>

    <span>نمای حبابی</span>

</div>

<div class="chartWrap incomeHubBubbleWrap totalIncomeBubbleWrap">

    <div class="incomeBubble">

        <div class="bubbleContent">

            <div class="bubbleIcon">💰</div>

            <div class="bubbleLabel">درآمد کل</div>

            <div class="moneyRow"><div class="bubbleAmount" id="totalBubbleIncome">۰ تومان</div></div>

        </div>

    </div>

</div>

<div class="incomeBackWrap">

    <button type="button" class="incomeBackButton" onclick="backToIncomeOptions()">↩ بازگشت به صفحه درآمد</button>

</div>

</section>

<section class="panel chartPanel incomeDetailPanel" id="chartSection">

<div class="panelTitle">

    <h2>📊 نمودار درآمد</h2>

    <span>

        نمایش درآمد بر اساس روز

    </span>

</div>

<div class="realChart">

    <div

        class="chartBars"

        id="chartBars">

        <div class="chartEmpty">

            در حال بارگذاری...

        </div>

    </div>

    <div

        class="chartSummary"

        id="chartSummary">

    </div>

</div>

<div class="chartIncomeTotalAction">

    <button type="button" class="incomeHubOption totalOption" onclick="showTotalIncome()">

        <span class="incomeHubOptionIcon">💰</span>

        <span class="incomeHubOptionText">

            <strong>مشاهده درآمد کل</strong>

            <small>نمایش مجموع تمام درآمدهای ثبت‌شده</small>

        </span>

        <span class="incomeHubArrow">←</span>

    </button>

</div>

</section>

<section class="panel" id="transactions">

<div class="panelTitle">

    <h2>🧾 تراکنش‌ها</h2>

    <span id="reportDate">

        گزارش مالی

    </span>

</div>

<div class="filterArea">

    <div class="filters">

        <button

            class="active"

            onclick="filterData('all',this)">

            همه

        </button>

        <button

            onclick="filterData('کارتخوان',this)">

            کارتخوان

        </button>

        <button

            onclick="filterData('نقدی',this)">

            نقدی

        </button>

        <button

            onclick="filterData('کارت به کارت',this)">

            کارت به کارت

        </button>

        <button

            onclick="filterData('برداشت نقدی',this)">

            برداشت نقدی

        </button>

    </div>

    <div class="searchBox">

        <input

            id="searchInput"

            type="text"

            placeholder="🔎 جستجوی مشتری، خدمت..."

            oninput="renderTransactions()">

    </div>

</div>

<div class="tableWrap">

    <table>

        <thead>

            <tr>

                <th>تاریخ</th>

                <th>ساعت</th>

                <th>مشتری</th>

                <th>خدمت</th>

                <th>مبلغ</th>

                <th>روش پرداخت</th>

                <th>وضعیت پرداخت</th>

                <th>توضیحات</th>

            </tr>

        </thead>

        <tbody id="transactionsBody"></tbody>

    </table>

</div>

</section>

<section class="panel" id="notes">

<div class="panelTitle">

    <h2>📝 یادداشت‌ها و کارها</h2>

    <span>

        Task Board

    </span>

</div>

<div class="noteForm">

    <textarea

        id="noteInput"

        placeholder="مثلاً: فردا قبض اینترنت پرداخت شود..."></textarea>

    <button

        type="button"

        class="noteAdd"

        id="noteAddButton"

        onclick="addNote(); return false;">

        ＋ ثبت یادداشت

    </button>

</div>

<div

    class="notes"

    id="notesContainer">

</div>

</section>

</div>

<nav class="mobileNav">

<a

href="#home"

class="active"

onclick="setNav(this)">

<span>⌂</span>

خانه

</a>

<a

href="#income"

onclick="setNav(this)">

<span>📈</span>

درآمد

</a>

<a

href="#transactions"

onclick="setNav(this)">

<span>🧾</span>

تراکنش‌ها

</a>

<a

href="#notes"

onclick="setNav(this)">

<span>📝</span>

یادداشت

</a>

<a

href="./index.html">

<span>↩</span>

خروج

</a>

</nav>

<button class="floatingTop" id="floatingTop" onclick="scrollToTop()" aria-label="رفتن به بالای صفحه">↑</button>

<button class="floatingChat" id="floatingChat" onclick="openChat()" aria-label="باز کردن چت">💬</button>

<!-- CASH WITHDRAWAL MODAL -->

<div class="cashWithdrawalOverlay" id="cashWithdrawalOverlay" onclick="closeCashWithdrawalFromBackdrop(event)">

  <div class="cashWithdrawalCard" role="dialog" aria-modal="true" aria-labelledby="cashWithdrawalTitle">

    <button type="button" class="cashWithdrawalClose" aria-label="بستن" title="بستن" onclick="event.stopPropagation();closeCashWithdrawal()">×</button>

<div class="cashWithdrawalHead">

  <div>

    <div class="cashWithdrawalTitle" id="cashWithdrawalTitle">💵 برداشت نقدی</div>

    <div class="cashWithdrawalSub">برداشت دستی از موجودی نقدی</div>

  </div>

</div>

<div class="cashWithdrawalForm">

  <label>مبلغ برداشت</label>

  <div class="cashAmountInputWrap">

    <input id="cashWithdrawalAmount" type="text" inputmode="numeric" placeholder="مثلاً ۵۰۰٬۰۰۰" autocomplete="off">

    <span>تومان</span>

  </div>

  <label>توضیحات</label>

  <textarea id="cashWithdrawalDescription" placeholder="مثلاً: برداشت بابت خرید لوازم..." rows="3"></textarea>

</div>

<div class="cashWithdrawalActions">

  <button type="button" class="cashCancelBtn" onclick="closeCashWithdrawal()">انصراف</button>

  <button type="button" class="cashWithdrawBtn" id="cashWithdrawBtn" onclick="submitCashWithdrawal()">💵 برداشت</button>

</div>

<div class="cashWithdrawalHistory" id="cashWithdrawalHistory">

  <div class="cashHistoryEmpty">هنوز برداشت نقدی دستی ثبت نشده است.</div>

</div>

<button type="button" class="cashWithdrawalToggle" id="cashWithdrawalToggle" aria-label="نمایش برداشت‌های ثبت‌شده" title="فقط برداشت‌های ثبت‌شده" onclick="toggleCashWithdrawals(event)">⌄</button>

  </div>

</div>

<div class="chatOverlay" id="chatOverlay" onclick="closeChatFromBackdrop(event)">

  <div class="chatWindow">

<div class="chatHeader">

  <div><h3>💬 گفت‌وگوی پنل</h3><small id="chatStatus">پیام‌ها</small></div>

  <button class="chatClose" onclick="closeChat()">×</button>

</div>

<div class="chatMessages" id="chatMessages"><div class="chartEmpty">در حال بارگذاری...</div></div>

<div class="chatComposer">

  <textarea id="chatInput" placeholder="پیامتان را بنویسید..." onkeydown="chatKeydown(event)"></textarea>

  <button type="button" class="chatSend" id="chatSendButton" onclick="sendChatMessage(); return false;">ارسال</button>

</div>

  </div>

</div>

<div class="paymentOverlay" id="paymentOverlay" onclick="closePaymentFromBackdrop(event)">

  <div class="paymentCard">

<div class="paymentTop">

  <div><div class="paymentTitle">💳 درخواست پرداخت</div><div class="paymentSub">درخواست جدید از پنل ثبت</div></div>

  <button class="paymentClose" onclick="dismissPayment()">×</button>

</div>

<div class="paymentInfo" id="paymentInfo"></div>

<div class="paymentActions">

  <button class="payConfirm" onclick="confirmPayment()">🟢 پرداخت شد</button>

  <button class="payDismiss" onclick="dismissPayment()">بستن</button>

</div>

  </div>

</div>

<!-- NOTE CONFIRM MODAL -->

<div class="noteModal" id="noteConfirmModal" onclick="closeNoteModalFromBackdrop(event)">

    <div class="noteModalCard" role="dialog" aria-modal="true" aria-labelledby="noteConfirmTitle">

        <button type="button" class="noteModalClose" aria-label="بستن" title="بستن" onclick="event.stopPropagation(); closeNoteModal()">×</button>

        <div class="noteModalTitle" id="noteConfirmTitle">🗑 حذف یادداشت</div>

        <div class="noteModalText" id="noteConfirmText">آیا از حذف این یادداشت مطمئن هستید؟ این عملیات رکورد مربوط را از شیت یادداشت‌ها نیز حذف می‌کند.</div>

        <div class="noteModalActions">

            <button type="button" onclick="closeNoteModal()">انصراف</button>

            <button type="button" class="danger" id="noteConfirmButton">🗑 بله، حذف شود</button>

        </div>

    </div>

</div>

<!-- NOTE EDIT MODAL -->

<div class="noteModal" id="noteEditModal" onclick="closeNoteModalFromBackdrop(event)">

    <div class="noteModalCard" role="dialog" aria-modal="true" aria-labelledby="noteEditTitle">

        <button type="button" class="noteModalClose" aria-label="بستن" title="بستن" onclick="event.stopPropagation(); closeNoteModal()">×</button>

        <div class="noteModalTitle" id="noteEditTitle">✏️ ویرایش یادداشت</div>

        <div class="noteModalText">متن یادداشت را ویرایش کنید؛ تغییرات مستقیماً در شیت یادداشت‌ها ذخیره می‌شود.</div>

        <textarea class="noteModalTextarea" id="noteEditInput" placeholder="متن یادداشت..."></textarea>

        <div class="noteModalActions">

            <button type="button" onclick="closeNoteModal()">انصراف</button>

            <button type="button" class="primary" onclick="submitNoteEdit()">💾 ذخیره تغییرات</button>

        </div>

    </div>

</div>

<div

class="toast"

id="toast">

</div>

<script>

/* =====================================================

   GOOGLE APPS SCRIPT

===================================================== */

const API_URL =

"https://script.google.com/macros/s/AKfycby4CtQL9ZEHkcjJFqVos0hQ1Z1C2xpI6ZO_dLGxiucGTCgLGzSoM3VgEuoRsOTXviQ4XA/exec";

/* =====================================================

   DATA

===================================================== */

let allTransactions = [];

let currentFilter = "all";

let localNotes = [];

let allMessages = [];

let currentPaymentMessage = null;

let moneyHidden = localStorage.getItem("jana_money_hidden") !== "false";

let messagePollTimer = null;

let messageLoading = false;

let paymentAudioContext = null;

let paymentAudioUnlocked = false;

let pendingPaymentSound = false;

function normalizeText(value){

    return String(value ?? "").replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/[\u200c\u200d]/g,"").replace(/\s+/g," ").trim().toLowerCase();

}

function normalizeMethod(value){ return normalizeText(value); }

function isTransferMethod(value){ const x=normalizeMethod(value); return x.includes("کارتبهکارت") || x.includes("کارت به کارت") || x.includes("کارت‌به‌کارت") || x.includes("کارت-به-کارت") || x.includes("کارت به‌کارت"); }

function isPosMethod(value){ return normalizeMethod(value)==="کارتخوان"; }

function isCashMethod(value){ return normalizeMethod(value)==="نقدی"; }

function isWithdrawalMethod(value){ const x=normalizeMethod(value); return x.includes("برداشت نقدی") || x.includes("برداشتنقدی"); }

function isRegularCashMethod(value){ return isCashMethod(value) && !isWithdrawalMethod(value); }

function secureMoney(value){ return moneyHidden ? "••••••" : money(value); }

function isPaymentPaid(message){

    const p=normalizeText(message?.payment ?? message?.paid ?? "");

    return p.includes("پرداختشد") || p.includes("paid") || message?.paid===true;

}

function getTransactionPaymentBadge(item){

    const id=String(item?.id ?? "").trim();

    if(!id || !Array.isArray(allMessages) || !allMessages.length) return '<span class="paymentStatus none">—</span>';

    const marker=`[TX:${id}]`;

    const related=allMessages.filter(m=>String(m?.text||"").includes(marker));

    if(related.some(isPaymentPaid)) return '<span class="paymentStatus paid">🟢 پرداخت شد</span>';

    if(related.length) return '<span class="paymentStatus pending">🟠 در انتظار پرداخت</span>';

    return '<span class="paymentStatus none">—</span>';

}

function toggleMoneyVisibility(){

    moneyHidden=!moneyHidden;

    localStorage.setItem("jana_money_hidden",String(moneyHidden));

    updateMoneyEyes();

    updateStats();

    updateBubble();

    renderTransactions();

    drawIncomeChart();

}

function updateMoneyEyes(){

    const b=document.getElementById("globalMoneyEye");

    if(!b)return;

    const text=b.querySelector(".eyeText");

    if(text)text.textContent=moneyHidden?"نمایش مبالغ":"مخفی کردن مبالغ";

    b.classList.toggle("isHidden",moneyHidden);

    b.setAttribute("aria-label",moneyHidden?"نمایش مبالغ":"مخفی کردن مبالغ");

    b.setAttribute("title",moneyHidden?"نمایش مبالغ":"مخفی کردن مبالغ");

}

/* =====================================================

   TEST NOTE

   یادداشت آزمایشی از پنل نمایش داده نمی‌شود

===================================================== */

const TEST_NOTE_TEXT =

"این یک یادداشت آزمایشی است";

/* =====================================================

   NUMBER

===================================================== */

function faNumber(number){

    return Number(number || 0)

        .toLocaleString("fa-IR");

}

/* =====================================================

   MONEY

===================================================== */

function money(number){

    return faNumber(number) + " تومان";

}

function formatCashInputValue(value){

    const digits=String(value??"").replace(/[^0-9۰-۹٠-٩]/g,"");

    if(!digits)return "";

    const latin=digits

        .replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d))

        .replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));

    const number=Number(latin);

    if(!Number.isFinite(number))return "";

    return number.toLocaleString("fa-IR");

}

function cashInputNumber(value){

    const digits=String(value??"")

        .replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d))

        .replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d))

        .replace(/[^0-9]/g,"");

    return Number(digits||0);

}

/* =====================================================

   SAFE TEXT

===================================================== */

function escapeHTML(value){

    return String(value ?? "")

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}

/* =====================================================

   PIN VALUE

===================================================== */

function isPinnedValue(value){

    return (

        value === true ||

        value === "true" ||

        value === 1 ||

        value === "1" ||

        String(value).toUpperCase() === "TRUE"

    );

}

/* =====================================================

   CLOUD POST

===================================================== */

async function cloudPost(payload){

    const response =

        await fetch(

            API_URL,

            {

                method:"POST",

                headers:{

                    "Content-Type":

                        "text/plain;charset=utf-8"

                },

                body:JSON.stringify(payload),

                cache:"no-store"

            }

        );

    const text =

        await response.text();

    let data;

    try{

        data =

            JSON.parse(text);

    }catch(error){

        console.error(

            "Invalid server response:",

            text

        );

        throw new Error(

            "پاسخ نامعتبر از سرور"

        );

    }

    if(!response.ok){

        throw new Error(

            "HTTP " + response.status

        );

    }

    if(

        data.status &&

        data.status !== "success" &&

        data.status !== "ok"

    ){

        throw new Error(

            data.message ||

            "عملیات ناموفق بود"

        );

    }

    return data;

}

/* =====================================================

   CLOUD GET

===================================================== */

async function getCloudData(){

    const response =

        await fetch(

            API_URL +

            "?action=getData&\_=" +

            Date.now(),

            {

                method:"GET",

                cache:"no-store"

            }

        );

    if(!response.ok){

        throw new Error(

            "HTTP " + response.status

        );

    }

    const data =

        await response.json();

    if(data.status !== "success"){

        throw new Error(

            data.message ||

            "خطا در دریافت اطلاعات"

        );

    }

    return data;

}

/* =====================================================

   LOAD CLOUD DATA

===================================================== */

async function loadCloudData(showMessage=true){

    if(showMessage){

        showToast(

            "در حال بارگذاری..."

        );

    }

    try{

        const data =

            await getCloudData();

        console.log(

            "JANA CLOUD DATA:",

            data

        );

        const cloudTransactions = Array.isArray(data.transactions)

            ? data.transactions

            : [];

        /* برداشت‌های ثبت‌شده در رفرش‌های پس‌زمینه گم نشوند. */

        const existingWithdrawals = Array.isArray(allTransactions)

            ? allTransactions.filter(item=>isWithdrawalMethod(item?.method))

            : [];

        const cloudIds = new Set(cloudTransactions.map(item=>String(item?.id??item?.cloudId??"")));

        const missingWithdrawals = existingWithdrawals.filter(item=>{

            const id=String(item?.id??item?.cloudId??"");

            return id && !cloudIds.has(id);

        });

        allTransactions = [...missingWithdrawals, ...cloudTransactions];

        saveLocalTransactions();

                /* =========================

           CLOUD NOTES SYNC

        ========================= */

        if(Array.isArray(data.notes)){

            localNotes = data.notes

                .filter(item => {

                    const text = String(item.text || item.note || "").trim();

                    return text && text !== TEST_NOTE_TEXT;

                })

                .map(item => ({

                    id:String(item.id),

                    cloudId:String(item.id),

                    text:String(item.text || item.note || "").trim(),

                    date:String(item.date || ""),

                    time:String(item.time || ""),

                    pinned:isPinnedValue(item.pinned),

                    done:String(item.status || "").trim() === "انجام شد"

                }));

        }

        saveNotes();

        updateStats();

        renderTransactions();

        renderNotes();

        updateBubble();

        drawIncomeChart();

        showDate();

        if(showMessage){

            showToast(

                "✅ اطلاعات بروزرسانی شد."

            );

        }

        return data;

    }catch(error){

        console.error(

            "Cloud Error:",

            error

        );

        try{

            const saved =

                localStorage.getItem(

                    "cafe_transactions"

                );

            allTransactions =

                saved

                ? JSON.parse(saved)

                : [];

        }catch(e){

            allTransactions = [];

        }

        updateStats();

        renderTransactions();

        renderNotes();

        updateBubble();

        drawIncomeChart();

        if(showMessage){

            showToast(

                "⚠️ اتصال برقرار نشد؛ اطلاعات ذخیره‌شده نمایش داده شد."

            );

        }

        return null;

    }

}

/* =====================================================

   SAVE LOCAL TRANSACTIONS

===================================================== */

function saveLocalTransactions(){

    try{

        localStorage.setItem(

            "cafe_transactions",

            JSON.stringify(

                allTransactions

            )

        );

    }catch(error){

        console.warn(

            "Local save failed:",

            error

        );

    }

}

/* =====================================================

   STATS

===================================================== */

function isSameDateAsToday(value){

    const raw=String(value??"").trim();

    if(!raw)return false;

    const normalizeDigits=v=>String(v)

        .replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d))

        .replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));

    const v=normalizeDigits(raw);

    const now=new Date();

    /* ISO / Gregorian dates, including timestamps */

    const isoMatch=v.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);

    if(isoMatch){

        return Number(isoMatch[1])===now.getFullYear() &&

               Number(isoMatch[2])===now.getMonth()+1 &&

               Number(isoMatch[3])===now.getDate();

    }

    /* Persian calendar date */

    const fa=normalizeDigits(new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"2-digit",day:"2-digit"}).format(now));

    const faClean=fa.replace(/[.\-]/g,"/").replace(/\s/g,"");

    const rawClean=v.replace(/[.\-]/g,"/").replace(/\s/g,"");

    if(rawClean===faClean)return true;

    /* If backend sent a JavaScript-readable timestamp, compare its local date. */

    const parsed=new Date(raw);

    if(!Number.isNaN(parsed.getTime())){

        return parsed.getFullYear()===now.getFullYear() &&

               parsed.getMonth()===now.getMonth() &&

               parsed.getDate()===now.getDate();

    }

    return false;

}

function methodMatchesFilter(method,filter){

    if(filter==="all")return true;

    if(isWithdrawalMethod(filter))return isWithdrawalMethod(method);

    if(isPosMethod(filter))return isPosMethod(method);

    if(isCashMethod(filter))return isRegularCashMethod(method);

    if(isTransferMethod(filter))return isTransferMethod(method);

    return normalizeMethod(method)===normalizeMethod(filter);

}


/* =====================================================
   MONTHLY REPORT ENGINE — Jalali/Persian calendar
   Transactions are never deleted. The selected month only changes
   the report calculations shown in the cards and income bubbles.
===================================================== */
const JANA_MONTH_KEY = "jana_selected_report_month_v2";
const JANA_RESET_KEY = "jana_report_month_resets_v2";
const JANA_THEME_KEY = "jana_report_theme_v2";

function normalizeDigitsForMonth(value){
    return String(value ?? "")
        .replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d))
        .replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

function getCurrentJalaliMonth(){
    const parts = new Intl.DateTimeFormat("en-US-u-ca-persian",{
        year:"numeric",month:"2-digit",day:"2-digit"
    }).formatToParts(new Date());
    const y=Number(parts.find(p=>p.type==="year")?.value||0);
    const m=Number(parts.find(p=>p.type==="month")?.value||0);
    const d=Number(parts.find(p=>p.type==="day")?.value||0); return {year:y,month:m,day:d,key:`${y}-${String(m).padStart(2,"0")}`,monthKey:`${y}-${String(m).padStart(2,"0")}`,dayKey:`${y}-${String(m).padStart(2,"0")}/${String(d).padStart(2,"0")}`,dayLabel:String(d).padStart(2,"0")};
}

function parseJalaliMonthFromDate(value){
    const raw=normalizeDigitsForMonth(value).trim();
    if(!raw)return null;

    // Direct Persian/Jalali date such as 1405/01/03 or 1405-01-03.
    const jalali=raw.match(/^(13|14)\d{2}[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
    if(jalali){
        const y=Number(raw.slice(0,4));
        const m=Number(jalali[2]);
        if(m>=1&&m<=12){ const d=Number(jalali[3]); return {year:y,month:m,day:d,key:`${y}-${String(m).padStart(2,"0")}`,monthKey:`${y}-${String(m).padStart(2,"0")}`,dayKey:`${y}-${String(m).padStart(2,"0")}/${String(d).padStart(2,"0")}`,dayLabel:String(d).padStart(2,"0")}; }
    }

    // Gregorian/ISO date or JS-readable timestamp -> Persian calendar.
    const iso=raw.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
    let date=null;
    if(iso){
        date=new Date(Number(iso[1]),Number(iso[2])-1,Number(iso[3]));
    }else{
        const parsed=new Date(value);
        if(!Number.isNaN(parsed.getTime())) date=parsed;
    }
    if(!date)return null;

    const parts=new Intl.DateTimeFormat("en-US-u-ca-persian",{
        year:"numeric",month:"2-digit",day:"2-digit"
    }).formatToParts(date);
    const y=Number(parts.find(p=>p.type==="year")?.value||0);
    const m=Number(parts.find(p=>p.type==="month")?.value||0);
    const d=Number(parts.find(p=>p.type==="day")?.value||0);
    if(!y||!m)return null;
    return {year:y,month:m,day:d,key:`${y}-${String(m).padStart(2,"0")}`,monthKey:`${y}-${String(m).padStart(2,"0")}`,dayKey:`${y}-${String(m).padStart(2,"0")}/${String(d).padStart(2,"0")}`,dayLabel:String(d).padStart(2,"0")};
}

function getTransactionReportMonth(item){
    return parseJalaliMonthFromDate(item?.date) || parseJalaliMonthFromDate(item?.time);
}

function getTransactionStableKey(item){
    const id=String(item?.id ?? item?.cloudId ?? "").trim();
    if(id)return "id:"+id;
    return [item?.date,item?.time,item?.customer,item?.service,item?.amount,item?.method,item?.description]
        .map(v=>String(v??"").trim()).join("|");
}

function getMonthResetMap(){
    try{
        const raw=localStorage.getItem(JANA_RESET_KEY);
        const parsed=raw?JSON.parse(raw):{};
        return parsed && typeof parsed==="object" ? parsed : {};
    }catch(e){return {};}
}

function saveMonthResetMap(map){
    try{localStorage.setItem(JANA_RESET_KEY,JSON.stringify(map));}catch(e){console.warn("Month reset save failed",e);}
}

function getSelectedReportMonth(){
    const current=getCurrentJalaliMonth();
    const saved=String(localStorage.getItem(JANA_MONTH_KEY)||"");
    if(!/^\d{4}-\d{2}$/.test(saved))return current;
    const [year,month]=saved.split("-").map(Number);
    if(year>current.year || (year===current.year && month>current.month))return current;
    if(month<1||month>12)return current;
    return {year,month,key:`${year}-${String(month).padStart(2,"0")}`};
}

function setSelectedReportMonth(monthObj){
    const current=getCurrentJalaliMonth();
    let y=Number(monthObj?.year),m=Number(monthObj?.month);
    if(!y||!m)return;
    if(y>current.year || (y===current.year && m>current.month)){y=current.year;m=current.month;}
    while(m<1){y--;m+=12;} while(m>12){y++;m-=12;}
    if(y>current.year || (y===current.year && m>current.month)){y=current.year;m=current.month;}
    localStorage.setItem(JANA_MONTH_KEY,`${y}-${String(m).padStart(2,"0")}`);
    refreshSelectedReportMonth();
}

function changeReportMonth(delta){
    const selected=getSelectedReportMonth();
    let y=selected.year,m=selected.month+Number(delta||0);
    while(m<1){y--;m+=12;} while(m>12){y++;m-=12;}
    const current=getCurrentJalaliMonth();
    if(y>current.year || (y===current.year && m>current.month))return;
    setSelectedReportMonth({year:y,month:m});
}

function getSelectedReportTransactions(filter){
    const selected=getSelectedReportMonth();
    const resetMap=getMonthResetMap();
    const excluded=new Set(Array.isArray(resetMap[selected.key])?resetMap[selected.key]:[]);
    let list=(Array.isArray(allTransactions)?allTransactions:[]).filter(item=>{
        const month=getTransactionReportMonth(item);
        return month && month.key===selected.key && !excluded.has(getTransactionStableKey(item));
    });
    if(filter && filter!=="all")list=list.filter(item=>methodMatchesFilter(item.method,filter));
    return list;
}

function getReportMonthLabel(monthObj=getSelectedReportMonth()){
    try{
        const sample=new Date(2020,0,1);
        // Use the Persian locale to obtain the localized month name.
        const formatter=new Intl.DateTimeFormat("fa-IR-u-ca-persian",{month:"long"});
        const name=formatter.format(sample);
        const names=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
        return `${names[monthObj.month-1]||name} ${faNumber(monthObj.year)}`;
    }catch(e){return `${monthObj.year}/${String(monthObj.month).padStart(2,"0")}`;}
}
function getReportMonthLabelShort(){return getReportMonthLabel();}

function updateReportMonthUI(){
    const selected=getSelectedReportMonth(), current=getCurrentJalaliMonth();
    const title=document.getElementById("selectedReportMonth");
    const sub=document.getElementById("selectedReportMonthSub");
    const prev=document.getElementById("monthPrevButton");
    const next=document.getElementById("monthNextButton");
    if(title)title.textContent=getReportMonthLabel(selected);
    if(sub)sub.textContent=selected.key===current.key?"ماه جاری • گزارش ماه شمسی":"گزارش ماه شمسی • اطلاعات قبلی حفظ شده است";
    if(next)next.disabled=selected.key===current.key;
    if(prev)prev.disabled=false;
    const bubbleLabels=document.querySelectorAll(".bubbleLabel");
    bubbleLabels.forEach(label=>{label.textContent=selected.key===current.key?"درآمد ماه جاری":`درآمد ${getReportMonthLabel(selected)}`;});
}

function refreshSelectedReportMonth(){
    updateReportMonthUI();
    updateStats();
    updateBubble();
    if(typeof drawIncomeChart==="function")drawIncomeChart();
}

function resetCurrentReportMonth(){
    const selected=getSelectedReportMonth();
    const monthTransactions=(Array.isArray(allTransactions)?allTransactions:[]).filter(item=>getTransactionReportMonth(item)?.key===selected.key);
    if(!monthTransactions.length){
        showToast("ℹ️ برای این ماه تراکنشی وجود ندارد.");
        return;
    }
    const map=getMonthResetMap();
    const existing=new Set(Array.isArray(map[selected.key])?map[selected.key]:[]);
    monthTransactions.forEach(item=>existing.add(getTransactionStableKey(item)));
    map[selected.key]=Array.from(existing);
    saveMonthResetMap(map);
    refreshSelectedReportMonth();
    showToast(`✅ گزارش ${getReportMonthLabel(selected)} صفر شد؛ تراکنش‌ها حذف نشدند.`);
}

function applySavedJanaTheme(){
    const light=localStorage.getItem(JANA_THEME_KEY)==="light";
    document.body.classList.toggle("janaLightTheme",light);
    const btn=document.getElementById("themeToggleButton");
    if(btn){btn.textContent=light?"🌙":"☀️";btn.title=light?"فعال کردن حالت تاریک":"فعال کردن حالت روشن";}
}
function toggleJanaTheme(){
    const light=!document.body.classList.contains("janaLightTheme");
    localStorage.setItem(JANA_THEME_KEY,light?"light":"dark");
    const btn=document.getElementById("themeToggleButton");
    if(btn){btn.classList.remove("rotating");void btn.offsetWidth;btn.classList.add("rotating");}
    applySavedJanaTheme();
}

function updateStats(){
    const transactions = getSelectedReportTransactions(currentFilter);
    const todayKey = getCurrentJalaliMonth ? (function(){ const now=new Date(); const parts=new Intl.DateTimeFormat("fa-IR-u-ca-persian",{year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now); const g=t=>parts.find(x=>x.type===t)?.value||""; return `${g("year")}/${g("month")}/${g("day")}`; })() : "";
    const dailyTransactions = transactions.filter(item=>{ const p=parseJalaliMonthFromDate(item?.date); return p && p.dayKey===todayKey; });
    let totalIncome = 0;
    let pos = 0;
    let cash = 0;
    let transfer = 0;

    transactions.forEach(item => {
        const amount = Number(item.amount || 0);
        totalIncome += amount;
        if(isPosMethod(item.method)) pos += amount;
        if(isCashMethod(item.method) || isWithdrawalMethod(item.method)) cash += amount;
        if(isTransferMethod(item.method)) transfer += amount;
    });

    const dailyTotalIncome = dailyTransactions.reduce((sum,item)=>sum + Number(item.amount || 0), 0);
    const totalIncomeEl = document.getElementById("totalIncome");
    if(totalIncomeEl) totalIncomeEl.textContent = secureMoney(dailyTotalIncome);

    const transactionCount = document.getElementById("transactionCount");
    if(transactionCount) transactionCount.textContent = moneyHidden ? "••••••" : faNumber(transactions.length);

    const posTotal = document.getElementById("posTotal");
    if(posTotal) posTotal.textContent = secureMoney(pos);

    const cashTotal = document.getElementById("cashTotal");
    if(cashTotal) cashTotal.textContent = secureMoney(cash);

    const transferTotal = document.getElementById("transferTotal");
    if(transferTotal) transferTotal.textContent = secureMoney(transfer);

    updateReportMonthUI();
    updateBubble();
    drawIncomeChart();
}

/* =====================================================

   BUBBLE

===================================================== */

function updateBubble(){
    /* «درآمد کل» فقط جمع درآمدهای ماه انتخاب‌شده است؛ از روز اول تا آخر همان ماه. */
    const monthTransactions = typeof getSelectedReportTransactions === "function"
        ? getSelectedReportTransactions("all")
        : [];
    const total = Array.isArray(monthTransactions)
        ? monthTransactions.reduce((sum,item)=>sum + Number(item.amount || 0), 0)
        : 0;
    const bubble = document.getElementById("bubbleIncome");
    if(bubble) bubble.textContent = secureMoney(total);
    const totalBubble = document.getElementById("totalBubbleIncome");
    if(totalBubble) totalBubble.textContent = secureMoney(total);
    const labels = document.querySelectorAll(".bubbleLabel");
    labels.forEach(label => {
        if(label.id === "") label.textContent = "درآمد کل";
    });
}

/* =====================================================

   CASH WITHDRAWAL

===================================================== */

function getCashWithdrawals(){

    return allTransactions

        .filter(item=>isWithdrawalMethod(item.method))

        .sort((a,b)=>{

            const aa=String(a?.date||"")+" "+String(a?.time||"");

            const bb=String(b?.date||"")+" "+String(b?.time||"");

            return bb.localeCompare(aa,"fa");

        });

}

function openCashWithdrawal(){

    const overlay=document.getElementById("cashWithdrawalOverlay");

    if(!overlay)return;

    renderCashWithdrawalHistory();

    overlay.classList.remove("open");

    void overlay.offsetWidth;

    overlay.classList.add("open");

    setTimeout(()=>document.getElementById("cashWithdrawalAmount")?.focus(),120);

}

function closeCashWithdrawal(){

    const overlay=document.getElementById("cashWithdrawalOverlay");

    if(overlay)overlay.classList.remove("open");

}

function closeCashWithdrawalFromBackdrop(event){

    if(event.target===event.currentTarget)closeCashWithdrawal();

}

function toggleCashWithdrawals(event){

    event?.stopPropagation();

    const history=document.getElementById("cashWithdrawalHistory");

    const toggle=document.getElementById("cashWithdrawalToggle");

    if(!history)return;

    const open=history.classList.toggle("open");

    if(toggle)toggle.classList.toggle("open",open);

    if(open)renderCashWithdrawalHistory();

}

function renderCashWithdrawalHistory(){

    const box=document.getElementById("cashWithdrawalHistory");

    if(!box)return;

    const withdrawals=allTransactions

        .filter(item=>isWithdrawalMethod(item?.method))

        .sort((a,b)=>{

            const aa=String(a?.date||"")+" "+String(a?.time||"");

            const bb=String(b?.date||"")+" "+String(b?.time||"");

            return bb.localeCompare(aa,"fa");

        });

    if(!withdrawals.length){

        box.innerHTML='<div class="cashHistoryTitle">برداشت‌های ثبت‌شده</div><div class="cashHistoryEmpty">هنوز برداشت نقدی دستی ثبت نشده است.</div>';

        return;

    }

    box.innerHTML='<div class="cashHistoryTitle">برداشت‌های ثبت‌شده</div>'+withdrawals.map(item=>{

        const amount=Math.abs(Number(item.amount||0));

        const desc=String(item.description||"").trim()||"بدون توضیحات";

        const date=formatTransactionDatePersian(item.date);

        const time=String(item.time||"");

        return `<div class="cashHistoryItem">

            <div class="cashHistoryMain">

                <div class="cashHistoryAmount">− ${escapeHTML(money(amount))}</div>

                <div class="cashHistoryDesc">${escapeHTML(desc)}</div>

            </div>

            <div class="cashHistoryDate">${escapeHTML(date)} ${escapeHTML(time)}</div>

        </div>`;

    }).join("");

}

async function submitCashWithdrawal(){

    const amountInput=document.getElementById("cashWithdrawalAmount");

    const descriptionInput=document.getElementById("cashWithdrawalDescription");

    const button=document.getElementById("cashWithdrawBtn");

    const amount=Math.round(cashInputNumber(amountInput?.value||0));

    const description=String(descriptionInput?.value||"").trim();

    if(!Number.isFinite(amount)||amount<=0){

        showToast("⚠️ مبلغ برداشت را وارد کنید.");

        amountInput?.focus();

        return;

    }

    if(button){

        button.disabled=true;

        button.textContent="⏳ در حال ثبت...";

    }

    const now=new Date();

    const date=new Intl.DateTimeFormat("fa-IR-u-ca-persian",{year:"numeric",month:"2-digit",day:"2-digit"}).format(now);

    const time=new Intl.DateTimeFormat("fa-IR",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now);

    const withdrawal={

        id:"local-withdrawal-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),

        date,

        time,

        customer:"برداشت دستی",

        service:"برداشت نقدی",

        amount:-Math.abs(amount),

        method:"برداشت نقدی",

        description:description||"برداشت نقدی دستی",

    };

    try{

        const response=await cloudPost({

            action:"addTransaction",

            date:withdrawal.date,

            time:withdrawal.time,

            customer:withdrawal.customer,

            service:withdrawal.service,

            amount:withdrawal.amount,

            method:withdrawal.method,

            description:withdrawal.description,

            id:withdrawal.id

        });

        const returnedId=String(response?.id||response?.transaction?.id||withdrawal.id);

        withdrawal.id=returnedId;

        withdrawal.cloudId=returnedId;

        allTransactions=[withdrawal,...allTransactions];

        saveLocalTransactions();

        updateStats();

        renderTransactions();

        drawIncomeChart();

        renderCashWithdrawalHistory();

        if(amountInput)amountInput.value="";

        if(descriptionInput)descriptionInput.value="";

        /* بعد از ثبت موفق، کارت همان لحظه از صفحه جمع شود. */

        closeCashWithdrawal();

        showToast("✅ برداشت نقدی ثبت شد و از جمع نقدی و درآمد کم شد.");

    }catch(error){

        console.error("Cash withdrawal failed:",error);

        showToast("⚠️ ثبت برداشت انجام نشد.");

    }finally{

        if(button){

            button.disabled=false;

            button.textContent="💵 برداشت";

        }

    }

}

document.addEventListener("keydown",event=>{

    const overlay=document.getElementById("cashWithdrawalOverlay");

    if(!overlay?.classList.contains("open"))return;

    if(event.key==="Escape"){

        event.preventDefault();

        closeCashWithdrawal();

    }

});

const cashWithdrawalAmountInput=document.getElementById("cashWithdrawalAmount");

if(cashWithdrawalAmountInput){

    cashWithdrawalAmountInput.addEventListener("input",event=>{

        const input=event.currentTarget;

        const digits=String(input.value||"").replace(/[^0-9۰-۹٠-٩]/g,"");

        input.value=formatCashInputValue(digits);

    });

}

/* =====================================================

   TRANSACTIONS

===================================================== */

function getFilteredTransactions(){

    let transactions =

        currentFilter === "all"

        ? [...allTransactions]

        : allTransactions.filter(

            item =>

                methodMatchesFilter(item.method,currentFilter)

        );

    const search =

        document.getElementById(

            "searchInput"

        )

        ?.value

        .trim()

        .toLowerCase();

    if(search){

        transactions =

            transactions.filter(item => {

                const text = [

                    item.date,

                    item.time,

                    item.customer,

                    item.service,

                    item.method,

                    item.description

                ]

                .join(" ")

                .toLowerCase();

                return normalizeText(text).includes(normalizeText(search));

            });

    }

    transactions.sort((a,b)=>{

        const aa=String(a?.date||"")+" "+String(a?.time||"");

        const bb=String(b?.date||"")+" "+String(b?.time||"");

        return bb.localeCompare(aa,"fa");

    });

    return transactions;

}

function formatTransactionDatePersian(value){

    const raw=String(value??"").trim();

    if(!raw)return "-";

    const normalizeDigits=value=>String(value??"")

        .replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d))

        .replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));

    const normalized=normalizeDigits(raw);

    /* اگر تاریخ از قبل شمسی باشد، فقط ارقام را فارسی و مرتب نمایش بده. */

    const fa=normalized.match(/^(13\d{2}|14\d{2}|15\d{2})[\/.-](\d{1,2})[\/.-](\d{1,2})/);

    if(fa){

        return [fa[1],String(fa[2]).padStart(2,"0"),String(fa[3]).padStart(2,"0")]

            .join("/")

            .replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

    }

    /* timestamp یا تاریخ میلادی را به تاریخ شمسی ایران تبدیل می‌کنیم. */

    const parsed=new Date(normalized);

    if(!Number.isNaN(parsed.getTime())){

        try{

            return new Intl.DateTimeFormat("fa-IR-u-ca-persian",{

                year:"numeric",month:"2-digit",day:"2-digit"

            }).format(parsed);

        }catch(e){}

    }

    return raw;

}

function renderTransactions(){

    const body =

        document.getElementById(

            "transactionsBody"

        );

    if(!body){

        return;

    }

    body.innerHTML = "";

    const transactions =

        getFilteredTransactions();

    if(!transactions.length){

        body.innerHTML = `

            <tr>

                <td colspan="8">

                    <div class="empty">

                        <div class="emptyIcon">

                            📭

                        </div>

                        هنوز تراکنشی برای نمایش وجود ندارد.

                    </div>

                </td>

            </tr>

        `;

        return;

    }

    transactions.forEach(item => {

        const row =

            document.createElement("tr");

        let methodClass = "";

        if(

            isCashMethod(item.method)

        ){

            methodClass = "cash";

        }

        if(

            isPosMethod(item.method)

        ){

            methodClass = "card";

        }

        if(

            isTransferMethod(item.method)

        ){

            methodClass = "transfer";

        }

        if(

            isWithdrawalMethod(item.method)

        ){

            methodClass = "withdrawal";

        }

        const methodLabel=isWithdrawalMethod(item.method)

            ? "برداشت نقدی"

            : (item.method || "-");

        row.innerHTML = `

            <td>

                ${escapeHTML(

                    formatTransactionDatePersian(item.date)

                )}

            </td>

            <td>

                ${escapeHTML(

                    item.time || "-"

                )}

            </td>

            <td>

                ${escapeHTML(

                    item.customer || "-"

                )}

            </td>

            <td>

                ${escapeHTML(

                    item.service || "-"

                )}

            </td>

            <td class="amount ${isWithdrawalMethod(item.method)?"withdrawalAmount":""}">

                ${secureMoney(item.amount)}

            </td>

            <td>

                <span

                    class="method ${methodClass}">

                    ${escapeHTML(methodLabel)}

                </span>

            </td>

            <td>

                ${getTransactionPaymentBadge(item)}

            </td>

            <td>

                ${escapeHTML(

                    item.description || "-"

                )}

            </td>

        `;

        body.appendChild(row);

    });

}

/* =====================================================

   FILTER

===================================================== */

function filterData(filter,button){

    currentFilter = filter;

    document.querySelectorAll(

        ".filters button"

    ).forEach(btn => {

        btn.classList.remove(

            "active"

        );

    });

    if(button){

        button.classList.add(

            "active"

        );

    }

    updateStats();

    renderTransactions();

}

/* =====================================================

   NOTES STORAGE — SIMPLE CLOUD SYNC

===================================================== */

let noteOperationBusy = false;

function loadNotes(){

    try{

        const saved=localStorage.getItem("cafe_notes");

        const parsed=saved?JSON.parse(saved):[];

        localNotes=Array.isArray(parsed)?parsed:[];

    }catch(error){

        localNotes=[];

    }

}

function saveNotes(){

    try{

        localStorage.setItem(

            "cafe_notes",

            JSON.stringify(Array.isArray(localNotes)?localNotes:[])

        );

    }catch(error){

        console.warn("Notes save failed:",error);

    }

}

function noteDisplayDate(note){

    if(note&&note.displayDate)return note.displayDate;

    if(note&&note.date&&String(note.date).includes(" • "))return note.date;

    return [note?.date||"",note?.time||""].filter(Boolean).join(" • ");

}

function findLocalNote(id){

    return localNotes.find(

        item =>

            String(item.id)===String(id) ||

            String(item.cloudId||"")===String(id)

    ) || null;

}

function getNoteById(id){

    return findLocalNote(id);

}

/*

   تبدیل مقدار پین به boolean.

   این تابع از قبل در فایل وجود دارد و اینجا دوباره تعریف نمی‌شود.

*/

/*

   مهم:

   برای عملیات ویرایش/حذف/پین/انجام‌شدن، قبل از POST یک بار

   اطلاعات فعلی Sheet2 را می‌خوانیم.

   اول ID را پیدا می‌کنیم؛ اگر ID قدیمی بود، با متن + تاریخ + ساعت

   رکورد واقعی Sheet2 را پیدا می‌کنیم.

*/

async function getFreshNoteInfo(note){

    if(!note)return null;

    const data=await getCloudData();

    if(!Array.isArray(data.notes)){

        throw new Error("داده یادداشت‌ها از سرور دریافت نشد");

    }

    const notes=data.notes.filter(item=>{

        const text=String(item.text||item.note||"").trim();

        return text && text!==TEST_NOTE_TEXT;

    });

    let match=null;

    const possibleIds=[

        note.cloudId,

        note.id

    ]

    .filter(Boolean)

    .map(value=>String(value).trim())

    .filter(Boolean);

    for(const id of possibleIds){

        match=notes.find(

            item=>String(item.id||"").trim()===id

        );

        if(match)break;

    }

    /* اگر ID محلی قدیمی/اشتباه بود، رکورد را با مشخصاتش پیدا کن. */

    if(!match){

        const text=String(note.text||"").trim();

        const date=String(note.date||"").trim();

        const time=String(note.time||"").trim();

        const matches=notes.filter(item=>{

            const itemText=String(item.text||item.note||"").trim();

            const itemDate=String(item.date||"").trim();

            const itemTime=String(item.time||"").trim();

            return (

                itemText===text &&

                (!date || !itemDate || itemDate===date) &&

                (!time || !itemTime || itemTime===time)

            );

        });

        if(matches.length){

            match=matches[matches.length-1];

        }

    }

    if(!match)return null;

    const fresh={

        id:String(match.id),

        cloudId:String(match.id),

        text:String(match.text||match.note||"").trim(),

        date:String(match.date||""),

        time:String(match.time||""),

        pinned:isPinnedValue(match.pinned),

        done:String(match.status||"").trim()==="انجام شد"

    };

    /* همان ID معتبر را روی نسخه محلی هم نگه می‌داریم. */

    note.id=fresh.id;

    note.cloudId=fresh.cloudId;

    note.date=fresh.date;

    note.time=fresh.time;

    note.pinned=fresh.pinned;

    note.done=fresh.done;

    return fresh;

}

/*

   Sheet2 منبع اصلی یادداشت‌هاست.

*/

async function refreshNotesFromCloud(){

    const data=await getCloudData();

    if(!Array.isArray(data.notes)){

        throw new Error("داده یادداشت‌ها از سرور دریافت نشد");

    }

    localNotes=data.notes

        .filter(item=>{

            const text=String(item.text||item.note||"").trim();

            return text && text!==TEST_NOTE_TEXT;

        })

        .map(item=>({

            id:String(item.id),

            cloudId:String(item.id),

            text:String(item.text||item.note||"").trim(),

            date:String(item.date||""),

            time:String(item.time||""),

            pinned:isPinnedValue(item.pinned),

            done:String(item.status||"").trim()==="انجام شد"

        }));

    saveNotes();

    renderNotes();

    return localNotes;

}

async function refreshNotesBestEffort(){

    try{

        await refreshNotesFromCloud();

        return true;

    }catch(error){

        console.warn("Notes refresh failed:",error);

        return false;

    }

}

async function runNoteOperation(button,operation,successMessage,errorMessage){

    if(noteOperationBusy)return false;

    noteOperationBusy=true;

    if(button){

        button.disabled=true;

        button.dataset.originalText=button.textContent;

        button.textContent="⏳";

    }

    try{

        await operation();

        showToast(successMessage);

        return true;

    }catch(error){

        console.error("Note operation error:",error);

        showToast(error.message||errorMessage);

        return false;

    }finally{

        noteOperationBusy=false;

        if(button){

            button.disabled=false;

            if(button.dataset.originalText){

                button.textContent=button.dataset.originalText;

                delete button.dataset.originalText;

            }

        }

    }

}

/* =========================

   ADD NOTE

========================= */

async function addNote(){

    const input=document.getElementById("noteInput");

    if(!input)return;

    const text=input.value.trim();

    if(!text){

        showToast("⚠️ اول متن یادداشت را بنویس.");

        input.focus();

        return;

    }

    if(text===TEST_NOTE_TEXT){

        showToast("⚠️ این یادداشت آزمایشی قابل ثبت نیست.");

        return;

    }

    const button=document.querySelector(".noteAdd");

    await runNoteOperation(

        button,

        async()=>{

            const now=new Date();

            const date=now.toLocaleDateString("fa-IR");

            const time=now.toLocaleTimeString(

                "fa-IR",

                {hour:"2-digit",minute:"2-digit"}

            );

            const result=await cloudPost({

                action:"addNote",

                date:date,

                time:time,

                note:text,

                status:"باز",

                pinned:false

            });

            /* ID برگشتی Apps Script را اگر موجود بود نگه می‌داریم. */

            if(result && result.id){

                localNotes.unshift({

                    id:String(result.id),

                    cloudId:String(result.id),

                    text:text,

                    date:date,

                    time:time,

                    pinned:false,

                    done:false

                });

                saveNotes();

                renderNotes();

            }

            input.value="";

            /* Sheet2 دوباره خوانده می‌شود تا UI دقیقاً با سرور یکی باشد. */

            await refreshNotesBestEffort();

        },

        "✅ یادداشت با موفقیت در Sheet2 ثبت شد.",

        "⚠️ ثبت یادداشت انجام نشد؛ اطلاعات قبلی دست‌نخورده باقی ماند."

    );

}

/* =========================

   UPDATE NOTE

========================= */

async function updateNoteCloud(note,changes={}){

    const fresh=await getFreshNoteInfo(note);

    if(!fresh){

        throw new Error("یادداشت موردنظر در Sheet2 پیدا نشد");

    }

    const payload={

        action:"updateNote",

        id:String(fresh.id),

        date:changes.date!==undefined ? changes.date : fresh.date,

        time:changes.time!==undefined ? changes.time : fresh.time,

        note:changes.text!==undefined ? changes.text : fresh.text,

        status:changes.status!==undefined

            ? changes.status

            : (fresh.done ? "انجام شد" : "باز"),

        pinned:changes.pinned!==undefined

            ? !!changes.pinned

            : !!fresh.pinned

    };

    await cloudPost(payload);

    return true;

}

function safeCssEscape(value){

    if(window.CSS && typeof window.CSS.escape==="function") return window.CSS.escape(String(value));

    return String(value).replace(/[^a-zA-Z0-9\_-]/g,function(ch){

        return "\\\\" + ch;

    });

}

/* =========================

   NOTE MODAL CLOSE

========================= */

function closeNoteModal(){

    const confirmModal=document.getElementById("noteConfirmModal");

    const editModal=document.getElementById("noteEditModal");

    if(confirmModal)confirmModal.classList.remove("open");

    if(editModal)editModal.classList.remove("open");

    window.currentDeleteNoteId="";

    window.currentEditingNoteId="";

    const confirmButton=document.getElementById("noteConfirmButton");

    if(confirmButton){

        confirmButton.disabled=false;

        confirmButton.onclick=confirmDeleteNote;

    }

}

function closeNoteModalFromBackdrop(event){

    if(event.target===event.currentTarget){

        closeNoteModal();

    }

}

/* =========================

   DELETE NOTE MODAL

========================= */

document.addEventListener("keydown",function(event){

    if(event.key!=="Escape") return;

    const edit=document.getElementById("noteEditModal");

    const confirm=document.getElementById("noteConfirmModal");

    if(edit?.classList.contains("open") || confirm?.classList.contains("open")){

        closeNoteModal();

    }

});

function openDeleteNoteModal(id){

    const note=getNoteById(id);

    if(!note)return;

    window.currentDeleteNoteId=String(note.cloudId||note.id||id);

    const preview=String(note.text||"").trim();

    const text=document.getElementById("noteConfirmText");

    if(text){

        text.textContent=

            `آیا از حذف یادداشت «${preview.slice(0,90)}${preview.length>90?"…":""}» مطمئن هستید؟ این عملیات رکورد مربوط را از شیت یادداشت‌ها نیز حذف می‌کند.`;

    }

    const modal=document.getElementById("noteConfirmModal");

    if(modal)modal.classList.add("open");

    const btn=document.getElementById("noteConfirmButton");

    if(btn){

        btn.disabled=false;

        btn.onclick=confirmDeleteNote;

    }

}

/* =========================

   DELETE NOTE

   ========================= */

async function confirmDeleteNote(){

    const id=String(window.currentDeleteNoteId||"").trim();

    if(!id){

        showToast("⚠️ شناسه یادداشت پیدا نشد.");

        return;

    }

    const btn=document.getElementById("noteConfirmButton");

    await runNoteOperation(

        btn,

        async()=>{

            await cloudPost({

                action:"deleteNote",

                id:id

            });

            /*

               حذف روی Sheet2 با موفقیت انجام شد.

               حالا همان لحظه نسخه محلی را هم حذف می‌کنیم تا کارت

               بدون نیاز به Refresh از صفحه ناپدید شود.

            */

            localNotes=localNotes.filter(note=>

                String(note.cloudId||note.id||"")!==id

            );

            saveNotes();

            /*

               اول خود کارت موجود روی صفحه را مستقیم حذف می‌کنیم.

               این کار مستقل از renderNotes است و باعث می‌شود کارت

               دقیقاً همان لحظه از صفحه ناپدید شود.

            */

            const deleteButton=document.querySelector(

                `#notesContainer button[data-note-action="delete"][data-note-id="${safeCssEscape(id)}"]`

            );

            const noteCard=deleteButton ? deleteButton.closest(".note") : null;

            if(noteCard){

                noteCard.remove();

            }

            /* برای هماهنگ ماندن کل لیست، یک رندر هم انجام می‌دهیم. */

            renderNotes();

            closeNoteModal();

        },

        "🗑 یادداشت از Sheet2 حذف شد.",

        "⚠️ حذف یادداشت انجام نشد."

    );

}

/* =========================

   EDIT NOTE

   ========================= */

function editNote(id){

    const note=getNoteById(id);

    if(!note)return;

    window.currentEditingNoteId=String(note.cloudId||note.id||id);

    const input=document.getElementById("noteEditInput");

    const modal=document.getElementById("noteEditModal");

    if(!input||!modal)return;

    input.value=note.text||"";

    modal.classList.add("open");

    setTimeout(()=>{

        input.focus();

        input.setSelectionRange(input.value.length,input.value.length);

    },50);

}

async function submitNoteEdit(){

    const id=String(window.currentEditingNoteId||"").trim();

    const input=document.getElementById("noteEditInput");

    if(!id||!input){

        showToast("⚠️ یادداشت موردنظر پیدا نشد.");

        return;

    }

    const cleanText=input.value.trim();

    if(!cleanText){

        showToast("⚠️ متن یادداشت نمی‌تواند خالی باشد.");

        return;

    }

    if(cleanText===TEST_NOTE_TEXT){

        showToast("⚠️ این متن آزمایشی قابل استفاده نیست.");

        return;

    }

    const note=getNoteById(id);

    const saveButton=document.querySelector("#noteEditModal .primary");

    await runNoteOperation(

        saveButton,

        async()=>{

            if(!note){

                throw new Error("یادداشت موردنظر پیدا نشد");

            }

            await cloudPost({

                action:"updateNote",

                id:id,

                date:note.date||"",

                time:note.time||"",

                note:cleanText,

                status:note.done ? "انجام شد" : "باز",

                pinned:!!note.pinned

            });

            /*

               ویرایش روی Sheet2 با موفقیت انجام شد.

               نسخه محلی را هم همان لحظه تغییر می‌دهیم تا کارت

               بدون Refresh متن جدید را نشان دهد.

            */

            note.text=cleanText;

            saveNotes();

            /*

               متن کارت را مستقیم روی DOM هم عوض می‌کنیم تا حتی اگر

               رندر لیست خطایی داشت، تغییر بلافاصله روی صفحه دیده شود.

            */

            const editButton=document.querySelector(

                `#notesContainer button[data-note-action="edit"][data-note-id="${safeCssEscape(id)}"]`

            );

            const editCard=editButton ? editButton.closest(".note") : null;

            const editText=editCard ? editCard.querySelector(".noteText") : null;

            if(editText){

                editText.innerHTML=escapeHTML(cleanText);

            }

            renderNotes();

            closeNoteModal();

        },

        "✏️ یادداشت ویرایش و در Sheet2 ذخیره شد.",

        "⚠️ ویرایش انجام نشد."

    );

}

/* =========================

   PIN NOTE

   مقدار صریح pinned مستقیماً برای Apps Script ارسال می‌شود.

   ========================= */

async function togglePin(id){

    const note=getNoteById(id);

    if(!note){

        showToast("⚠️ یادداشت موردنظر پیدا نشد.");

        return;

    }

    const cloudId=String(note.cloudId||note.id||"").trim();

    if(!cloudId){

        showToast("⚠️ شناسه یادداشت پیدا نشد.");

        return;

    }

    const newPinned=!isPinnedValue(note.pinned);

    await runNoteOperation(

        null,

        async()=>{

            await cloudPost({

                action:"updateNote",

                id:cloudId,

                date:note.date||"",

                time:note.time||"",

                note:note.text||"",

                status:note.done ? "انجام شد" : "باز",

                pinned:newPinned

            });

            await refreshNotesBestEffort();

        },

        newPinned

            ? "📌 یادداشت پین شد و در Sheet2 ذخیره شد."

            : "📌 پین یادداشت برداشته شد.",

        "⚠️ تغییر پین انجام نشد."

    );

}

/* =========================

   DONE NOTE

   مقدار صریح status مستقیماً برای Apps Script ارسال می‌شود.

   ========================= */

async function toggleDone(id){

    const note=getNoteById(id);

    if(!note){

        showToast("⚠️ یادداشت موردنظر پیدا نشد.");

        return;

    }

    const cloudId=String(note.cloudId||note.id||"").trim();

    if(!cloudId){

        showToast("⚠️ شناسه یادداشت پیدا نشد.");

        return;

    }

    const newDone=!Boolean(note.done);

    await runNoteOperation(

        null,

        async()=>{

            await cloudPost({

                action:"updateNote",

                id:cloudId,

                date:note.date||"",

                time:note.time||"",

                note:note.text||"",

                status:newDone ? "انجام شد" : "باز",

                pinned:!!note.pinned

            });

            await refreshNotesBestEffort();

        },

        newDone

            ? "✅ تسک انجام شد و در Sheet2 ذخیره شد."

            : "↩ تسک دوباره باز شد.",

        "⚠️ تغییر وضعیت انجام نشد."

    );

}

/* =========================

   RENDER NOTES

========================= */

function renderNotes(){

    const container=document.getElementById("notesContainer");

    if(!container)return;

    const notes=[...localNotes]

        .filter(

            note=>String(note.text||"").trim()!==TEST_NOTE_TEXT

        )

        .sort(

            (a,b)=>

                Number(!!b.pinned)-Number(!!a.pinned)

        );

    container.innerHTML="";

    if(!notes.length){

        container.innerHTML=

            `<div class="empty" style="grid-column:1/-1">

                <div class="emptyIcon">📝</div>

                هنوز یادداشتی ثبت نشده است.

            </div>`;

        return;

    }

    notes.forEach(note=>{

        const div=document.createElement("div");

        div.className=

            "note"+

            (note.pinned?" pinned":"")+

            (note.done?" done":"");

        div.innerHTML=`

            ${note.pinned?'<div class="pinBadge">📌</div>':""}

            <div class="noteText">${escapeHTML(note.text||"")}</div>

            <div class="noteDate">${escapeHTML(noteDisplayDate(note))}</div>

            <div class="noteActions">

                <button

                    type="button"

                    class="doneBtn ${note.done?"doneActive":""}"

                    data-note-action="done"

                    data-note-id="${escapeHTML(String(note.cloudId||note.id||""))}"

                >✓ انجام شد</button>

                <button

                    type="button"

                    class="${note.pinned?"pinActive":""}"

                    data-note-action="pin"

                    data-note-id="${escapeHTML(String(note.cloudId||note.id||""))}"

                >${note.pinned?"📌 برداشتن پین":"📌 پین"}</button>

                <button

                    type="button"

                    class="edit"

                    data-note-action="edit"

                    data-note-id="${escapeHTML(String(note.cloudId||note.id||""))}"

                >✏️ ویرایش</button>

                <button

                    type="button"

                    class="delete"

                    data-note-action="delete"

                    data-note-id="${escapeHTML(String(note.cloudId||note.id||""))}"

                >🗑 حذف</button>

            </div>`;

        container.appendChild(div);

    });

}

/* =========================

   NOTE BUTTON WIRING

   اتصال مستقیم دکمه‌های یادداشت

   بدون وابستگی به onclick داخل HTML

========================= */

(function setupNoteButtonWiring(){

    function bind(){

        const container=document.getElementById("notesContainer");

        if(!container || container.dataset.noteWired==="1")return;

        container.dataset.noteWired="1";

        container.addEventListener("click",function(event){

            const button=event.target.closest("button[data-note-action]");

            if(!button || !container.contains(button))return;

            event.preventDefault();

            event.stopPropagation();

            const id=button.getAttribute("data-note-id") || "";

            const action=button.getAttribute("data-note-action");

            if(!id){

                showToast("⚠️ شناسه یادداشت پیدا نشد.");

                return;

            }

            if(action==="done"){

                toggleDone(id);

            }else if(action==="pin"){

                togglePin(id);

            }else if(action==="edit"){

                editNote(id);

            }else if(action==="delete"){

                openDeleteNoteModal(id);

            }

        });

    }

    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);

    else bind();

})();

/* توابع یادداشت عمداً روی window هم قرار می‌گیرند تا از هر بخش صفحه

   و حتی در صورت وجود اسکریپت‌های قدیمی، قابل دسترسی باشند. */

window.openDeleteNoteModal=openDeleteNoteModal;

window.confirmDeleteNote=confirmDeleteNote;

(function setupNoteAddButton(){
    function bind(){
        const button=document.getElementById("noteAddButton");
        if(!button || button.dataset.noteAddWired==="1")return;
        button.dataset.noteAddWired="1";
        button.addEventListener("click",function(event){
            event.preventDefault();
            event.stopPropagation();
            addNote();
        });
    }
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);
    else bind();
})();

window.editNote=editNote;

window.submitNoteEdit=submitNoteEdit;

window.togglePin=togglePin;

window.toggleDone=toggleDone;

/* =====================================================

   INCOME CHART

===================================================== */

function parseDateKey(value){

    return String(

        value || ""

    ).trim();

}

function drawIncomeChart(){
    const chartBars=document.getElementById("chartBars");
    const chartSummary=document.getElementById("chartSummary");
    if(!chartBars)return;

    /* نمودار دقیقاً از اول تا اول ماه شمسی انتخاب‌شده محاسبه می‌شود. */
    const selectedMonthObj = getSelectedReportMonth();
    const monthKey = selectedMonthObj ? selectedMonthObj.key : getCurrentJalaliMonth().key;
    const monthTransactions = getSelectedReportTransactions("all");
    const normalizeDigits=value=>String(value??"")
        .replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d))
        .replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));
    const dailyMap={};
    const displayMap={};

    monthTransactions.forEach(item=>{
        const parsed=parseJalaliMonthFromDate(item?.date);
        if(!parsed || parsed.monthKey!==monthKey)return;
        const dayKey=parsed.dayKey;
        const amount=Number(item.amount||0);
        dailyMap[dayKey]=(dailyMap[dayKey]||0)+amount;
        displayMap[dayKey]=parsed.dayLabel || dayKey;
    });

    const monthMatch=String(monthKey).match(/^(\d{4})-(\d{1,2})$/);
    let daysInMonth=31;
    if(monthMatch){
        const y=Number(monthMatch[1]), m=Number(monthMatch[2]);
        daysInMonth = m<=6 ? 31 : (m<=11 ? 30 : ((y%4===3)?30:29));
    }

    const entries=[];
    for(let day=1;day<=daysInMonth;day++){
        const dayKey=`${monthKey}/${String(day).padStart(2,"0")}`;
        entries.push([dayKey,dailyMap[dayKey]||0,displayMap[dayKey]||String(day).padStart(2,"0")]);
    }

    const maxValue=Math.max(...entries.map(x=>x[1]),1);
    chartBars.innerHTML="";
    entries.forEach(([key,value,labelText])=>{
        const item=document.createElement("div");
        item.className="chartBarItem";
        const valueBox=document.createElement("div");
        valueBox.className="chartBarValue";
        valueBox.textContent=secureMoney(value);
        const bar=document.createElement("div");
        bar.className="chartBar";
        bar.style.height=Math.max(5,(value/maxValue)*235)+"px";
        bar.title=money(value);
        const label=document.createElement("div");
        label.className="chartBarLabel";
        label.textContent=labelText;
        item.append(valueBox,bar,label);
        chartBars.appendChild(item);
    });

    const chartTotal=entries.reduce((sum,x)=>sum+x[1],0);
    const activeDays=entries.filter(x=>x[1]>0);
    const average=activeDays.length ? chartTotal/activeDays.length : 0;
    if(chartSummary){
        chartSummary.innerHTML=`
            <div class="chartSummaryItem">درآمد این ماه <strong>${secureMoney(chartTotal)}</strong></div>
            <div class="chartSummaryItem">روزهای دارای درآمد <strong>${faNumber(activeDays.length)}</strong></div>
            <div class="chartSummaryItem">میانگین روزهای دارای درآمد <strong>${secureMoney(average)}</strong></div>
        `;
    }
}

/* =====================================================

   OPEN CHART

===================================================== */

function showIncomeDetail(sectionId){

    const totalSection=document.getElementById("totalIncomeSection");

    const chartSection=document.getElementById("chartSection");

    const hub=document.getElementById("incomeHub");

    const section=document.getElementById(sectionId);

    /* همیشه فقط یک صفحه درآمد باز باشد. */

    if(totalSection)totalSection.classList.remove("incomeDetailOpen","incomeSlideIn");

    if(chartSection)chartSection.classList.remove("incomeDetailOpen","incomeSlideIn");

    if(hub){

        hub.classList.add("incomeSlideAway");

        setTimeout(()=>{

            hub.style.display="none";

        },380);

    }

    if(section){

        section.style.display="block";

        section.classList.add("incomeDetailOpen","incomeSlideIn");

    }

}

function showTotalIncome(){

    /* همان حباب اصلی صفحه درآمد را با مبلغ کل نشان می‌دهیم. */

    const total = allTransactions.reduce(

        (sum,item)=>sum + Number(item.amount || 0),

        0

    );

    const bubble=document.getElementById("bubbleIncome");

    const label=document.querySelector("#incomeHub .bubbleLabel");

    if(bubble)bubble.textContent=secureMoney(total);

    if(label)label.textContent="درآمد کل";

    backToIncomeOptions();

}

function backToIncomeOptions(){

    const totalSection=document.getElementById("totalIncomeSection");

    const chartSection=document.getElementById("chartSection");

    const hub=document.getElementById("incomeHub");

    if(totalSection){

        totalSection.classList.remove("incomeDetailOpen","incomeSlideIn");

        totalSection.style.display="none";

    }

    if(chartSection){

        chartSection.classList.remove("incomeDetailOpen","incomeSlideIn");

        chartSection.style.display="none";

    }

    if(hub){

        hub.style.display="block";

        hub.classList.remove("incomeSlideAway");

        hub.style.animation="incomeSlideIn .46s cubic-bezier(.22,.8,.2,1) both";

        setTimeout(()=>{

            hub.style.animation="";

        },470);

    }

}

function openChart(){

    drawIncomeChart();

    showIncomeDetail("chartSection");

}

/* =====================================================

   REPORT DATE

===================================================== */

function showDate(){

    const update=()=>{

        const now=new Date();

        const date=now.toLocaleDateString("fa-IR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

        const time=now.toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

        const live=document.getElementById("liveDateTime");

        if(live)live.textContent="📅 "+date+" • 🕐 "+time;

        const reportDate=document.getElementById("reportDate");

        if(reportDate)reportDate.textContent="آخرین بروزرسانی: "+now.toLocaleDateString("fa-IR")+" • "+time;

    };

    update();

    clearInterval(window.janaClockTimer);

    window.janaClockTimer=setInterval(update,1000);

}

/* =====================================================

   TOAST

===================================================== */

let toastTimer;

function showToast(message){

    const toast =

        document.getElementById(

            "toast"

        );

    if(!toast){

        return;

    }

    toast.textContent =

        message;

    toast.classList.add(

        "show"

    );

    clearTimeout(

        toastTimer

    );

    toastTimer =

        setTimeout(

            () => {

                toast.classList.remove(

                    "show"

                );

            },

            3000

        );

}

/* =====================================================

   MOBILE NAV

===================================================== */

function setNav(element){

    document.querySelectorAll(

        ".mobileNav a"

    ).forEach(item => {

        item.classList.remove(

            "active"

        );

    });

    element.classList.add(

        "active"

    );

}

/* =====================================================

   SCROLL NAV

===================================================== */

if(

    "IntersectionObserver"

    in window

){

    const sections =

        document.querySelectorAll(

            "#home,#income,#transactions,#notes"

        );

    const observer =

        new IntersectionObserver(

            entries => {

                entries.forEach(

                    entry => {

                        if(

                            entry.isIntersecting

                        ){

                            const id =

                                entry.target.id;

                            document

                                .querySelectorAll(

                                    ".mobileNav a"

                                )

                                .forEach(

                                    link => {

                                        link.classList.remove(

                                            "active"

                                        );

                                        if(

                                            link.getAttribute(

                                                "href"

                                            ) ===

                                            "#" + id

                                        ){

                                            link.classList.add(

                                                "active"

                                            );

                                        }

                                    }

                                );

                        }

                    }

                );

            },

            {

                threshold:.35

            }

        );

    sections.forEach(

        section =>

            observer.observe(section)

    );

}

/* =====================================================

   ENTER TO ADD NOTE

===================================================== */

const noteInput =

    document.getElementById(

        "noteInput"

    );

if(noteInput){

    noteInput.addEventListener(

        "keydown",

        function(e){

            if(

                e.key === "Enter" &&

                (e.ctrlKey || e.metaKey)

            ){

                e.preventDefault();

                addNote();

            }

        }

    );

}

/* =====================================================

   MOUSE

===================================================== */

const mouseGlow =

    document.getElementById(

        "mouseGlow"

    );

const cursorDot =

    document.getElementById(

        "cursorDot"

    );

let mouseX =

    window.innerWidth / 2;

let mouseY =

    window.innerHeight / 2;

let glowX =

    mouseX;

let glowY =

    mouseY;

document.addEventListener(

    "mousemove",

    function(e){

        mouseX =

            e.clientX;

        mouseY =

            e.clientY;

        if(cursorDot){

            cursorDot.style.left =

                mouseX + "px";

            cursorDot.style.top =

                mouseY + "px";

        }

    }

);

function animateGlow(){

    glowX +=

        (mouseX - glowX) * .08;

    glowY +=

        (mouseY - glowY) * .08;

    if(mouseGlow){

        mouseGlow.style.left =

            glowX + "px";

        mouseGlow.style.top =

            glowY + "px";

    }

    requestAnimationFrame(

        animateGlow

    );

}

animateGlow();

/* =====================================================

   MESSAGES / MINI CHAT / PAYMENT

===================================================== */

function renderMiniChat(){

    const box=document.getElementById("miniChatItems");

    if(!box)return;

    if(!allMessages.length){box.innerHTML='<span class="miniChatEmpty">هنوز پیامی ثبت نشده است.</span>';return;}

    const recent=[...allMessages].slice(-5).reverse();

    box.innerHTML=recent.map(m=>{

        const unread=!m.read && String(m.sender||"").trim()!=="خانم دهقان";

        const text=String(m.text||"").replace(/\[TX:[^\]]+\]/g,"").replace(/\s+/g," ").trim();

        return `<button type="button" class="miniChatItem ${unread?"unread":""}" onclick="openChat()">${unread?"🔵 ":""}${escapeHTML(text||"پیام")}</button>`;

    }).join("");

}

async function loadMessages(){
    if(messageLoading)return allMessages;
    messageLoading=true;
    try{
        let loaded=false;
        let lastError=null;
        try{
            const response=await fetch(API_URL+"?action=getMessages&_="+Date.now(),{method:"GET",cache:"no-store"});
            if(!response.ok)throw new Error("HTTP "+response.status);
            const data=await response.json();
            if(data.status==="success"||data.status==="ok"){
                allMessages=Array.isArray(data.messages)?data.messages:[];
                loaded=true;
            }else{
                throw new Error(data.message||"خطا در دریافت پیام‌ها");
            }
        }catch(error){
            lastError=error;
            console.warn("Messages endpoint failed:",error);
        }
        if(!loaded){
            try{
                const data=await getCloudData();
                if(Array.isArray(data.messages)){
                    allMessages=data.messages;
                    loaded=true;
                }else{
                    throw new Error("داده پیام‌ها از سرور دریافت نشد");
                }
            }catch(error){
                lastError=error;
                console.warn("Messages getData failed:",error);
            }
        }
        if(!loaded){
            console.warn("Messages could not be loaded:",lastError);
            allMessages=[];
        }
        try{renderMiniChat();}catch(e){console.warn("renderMiniChat failed:",e);}
        try{renderChatMessages();}catch(e){console.warn("renderChatMessages failed:",e);}
        try{checkPaymentRequests();}catch(e){console.warn("checkPaymentRequests failed:",e);}
        try{updateChatBadge();}catch(e){console.warn("updateChatBadge failed:",e);}
        return allMessages;
    }finally{
        messageLoading=false;
    }
}

function updateChatBadge(){

    const unread=allMessages.filter(m=>String(m.sender||"").trim()!=="خانم دهقان" && !m.read).length;

    const btn=document.getElementById("floatingChat");

    if(btn)btn.innerHTML=unread?`💬<sup style="font-size:9px;background:#008cff;color:#fff;border-radius:20px;padding:2px 5px;position:absolute;top:4px;right:4px">${unread>99?"99+":unread}</sup>`:"💬";

}

function renderChatMessages(){

    const box=document.getElementById("chatMessages"); if(!box)return;

    if(!allMessages.length){box.innerHTML='<div class="chartEmpty">هنوز پیامی ثبت نشده است.</div>';return;}

    box.innerHTML="";

    allMessages.forEach(m=>{

        const outgoing=String(m.sender||"").trim()==="خانم دهقان";

        const el=document.createElement("div"); el.className="chatMsg "+(outgoing?"out":"in");

        el.innerHTML=`<div>${escapeHTML(m.text||"")}</div><div class="chatMeta"><span>${escapeHTML(m.sender||"")}</span><span>${escapeHTML((m.date||"")+" • "+(m.time||""))}</span>${!m.read&&!outgoing?'<span class="chatUnread">جدید</span>':''}</div>`;

        box.appendChild(el);

    });

    box.scrollTop=box.scrollHeight;

}

async function openChat(){
    const overlay=document.getElementById("chatOverlay");
    if(!overlay)return;
    overlay.classList.add("open");
    const status=document.getElementById("chatStatus");
    if(status)status.textContent="در حال دریافت پیام‌ها…";
    try{
        await loadMessages();
        const incoming=allMessages.filter(m=>String(m.sender||"").trim()!=="خانم دهقان"&&!m.read);
        for(const m of incoming){
            try{
                await cloudPost({action:"markMessageRead",id:m.id,status:"خوانده شد"});
                m.read=true;
            }catch(e){console.warn("markMessageRead failed:",e);}
        }
        if(status)status.textContent=allMessages.length?"پیام‌ها آماده است":"هنوز پیامی ثبت نشده است";
        updateChatBadge();
    }catch(error){
        console.error("openChat failed:",error);
        if(status)status.textContent="خطا در دریافت پیام‌ها";
        renderChatMessages();
    }
}

function closeChat(){document.getElementById("chatOverlay")?.classList.remove("open")}

function closeChatFromBackdrop(e){if(e.target.id==="chatOverlay")closeChat()}

function chatKeydown(e){

    if(e.key!=="Enter" || e.shiftKey || e.isComposing)return;

    e.preventDefault();

    if(e.repeat)return;

    sendChatMessage();

}

async function sendChatMessage(){
    const input=document.getElementById("chatInput");
    const button=document.getElementById("chatSendButton");
    const text=input?.value.trim();
    if(!text)return false;
    if(button)button.disabled=true;
    try{
        await cloudPost({action:"addMessage",sender:"خانم دهقان",text:text,message:text,status:"خوانده نشده",payment:"پرداخت نشده"});
        if(input)input.value="";
        await loadMessages();
        showToast("✉️ پیام ارسال شد.");
        return true;
    }catch(e){
        console.error("sendChatMessage failed:",e);
        showToast("⚠️ ارسال پیام انجام نشد.");
        return false;
    }finally{
        if(button)button.disabled=false;
    }
}

function parsePaymentMessage(m){
    const text=String(m?.text||m?.message||"");
    const clean=value=>String(value??"").replace(/[*_`]/g,"").trim();
    const tx=(text.match(/\[TX:([^\]]+)\]/i)||[])[1]||String(m?.transactionId||m?.txId||m?.transaction?.id||"");
    const pick=(patterns)=>{
        for(const re of patterns){
            const hit=text.match(re);
            if(hit?.[1])return clean(hit[1]);
        }
        return "-";
    };
    const customer=pick([/مشتری\s*[:：]\s*([^|\n]+)/i,/نام مشتری\s*[:：]\s*([^|\n]+)/i])!=="-" ? pick([/مشتری\s*[:：]\s*([^|\n]+)/i,/نام مشتری\s*[:：]\s*([^|\n]+)/i]) : clean(m?.customer||m?.transaction?.customer||"-");
    const service=pick([/خدمت\s*[:：]\s*([^|\n]+)/i,/سرویس\s*[:：]\s*([^|\n]+)/i,/درخواست پرداخت\s*[:：]\s*([^|\n]+)/i])!=="-" ? pick([/خدمت\s*[:：]\s*([^|\n]+)/i,/سرویس\s*[:：]\s*([^|\n]+)/i,/درخواست پرداخت\s*[:：]\s*([^|\n]+)/i]) : clean(m?.service||m?.transaction?.service||"-");
    const amount=pick([/مبلغ\s*[:：]\s*([^|\n]+)/i,/مبلغ\s+([^|\n]+)/i,/amount\s*[:=]\s*([^|\n]+)/i])!=="-" ? pick([/مبلغ\s*[:：]\s*([^|\n]+)/i,/مبلغ\s+([^|\n]+)/i,/amount\s*[:=]\s*([^|\n]+)/i]) : clean(m?.amount||m?.transaction?.amount||"-");
    return {tx:clean(tx),customer,service,amount};
}

function getPaymentAudioContext(){

    try{

        const AudioCtx=window.AudioContext||window.webkitAudioContext;

        if(!AudioCtx)return null;

        if(!paymentAudioContext){

            paymentAudioContext=new AudioCtx();

        }

        return paymentAudioContext;

    }catch(e){

        return null;

    }

}

function unlockPaymentAudio(){

    try{

        const ctx=getPaymentAudioContext();

        if(!ctx)return;

        if(ctx.state==="suspended"){

            ctx.resume().then(()=>{

                paymentAudioUnlocked=true;

                if(pendingPaymentSound){

                    pendingPaymentSound=false;

                    playPaymentSound(true);

                }

            }).catch(()=>{});

        }else{

            paymentAudioUnlocked=true;

            if(pendingPaymentSound){

                pendingPaymentSound=false;

                playPaymentSound(true);

            }

        }

    }catch(e){}

}

function playPaymentSound(force=false){

    try{

        const ctx=getPaymentAudioContext();

        if(!ctx)return;

        if(ctx.state==="suspended"){

            pendingPaymentSound=true;

            if(force){

                ctx.resume().then(()=>{

                    paymentAudioUnlocked=true;

                    pendingPaymentSound=false;

                    playPaymentSound(true);

                }).catch(()=>{});

            }

            return;

        }

        if(!force && !paymentAudioUnlocked){

            pendingPaymentSound=true;

            return;

        }

        paymentAudioUnlocked=true;

        const now=ctx.currentTime;

        const master=ctx.createGain();

        master.gain.setValueAtTime(.0001,now);

        master.gain.exponentialRampToValueAtTime(.20,now+.025);

        master.gain.exponentialRampToValueAtTime(.0001,now+.62);

        master.connect(ctx.destination);

        [

            {frequency:880,start:0,duration:.16},

            {frequency:1175,start:.12,duration:.18},

            {frequency:988,start:.25,duration:.30}

        ].forEach(tone=>{

            const osc=ctx.createOscillator();

            const gain=ctx.createGain();

            osc.type="sine";

            osc.frequency.setValueAtTime(tone.frequency,now+tone.start);

            gain.gain.setValueAtTime(.0001,now+tone.start);

            gain.gain.exponentialRampToValueAtTime(.65,now+tone.start+.015);

            gain.gain.exponentialRampToValueAtTime(.0001,now+tone.start+tone.duration);

            osc.connect(gain);

            gain.connect(master);

            osc.start(now+tone.start);

            osc.stop(now+tone.start+tone.duration+.02);

        });

    }catch(e){

        console.warn("Payment notification sound failed:",e);

    }

}

function showPaymentNotification(message){

    currentPaymentMessage=message;

    const p=parsePaymentMessage(message);

    const info=document.getElementById("paymentInfo");

    if(info){

        info.innerHTML=

            `<div class="paymentInfoRow"><span>مشتری</span><span>${escapeHTML(p.customer)}</span></div>`+

            `<div class="paymentInfoRow"><span>خدمت</span><span>${escapeHTML(p.service)}</span></div>`+

            `<div class="paymentInfoRow"><span>مبلغ</span><span class="paymentAmount">${escapeHTML(p.amount)}</span></div>`+

            `<div class="paymentInfoRow"><span>تاریخ و ساعت</span><span>${escapeHTML((message.date||"")+" • "+(message.time||""))}</span></div>`;

    }

    const overlay=document.getElementById("paymentOverlay");

    if(overlay){

        overlay.classList.remove("open");

        void overlay.offsetWidth;

        overlay.classList.add("open");

    }

}

function checkPaymentRequests(){

    const pending=allMessages.find(m=>{

        const sender=String(m?.sender||"").trim();

        const text=String(m?.text||"");

        const txMarker=/\[TX:[^\]]+\]/i.test(text);

        const paymentRequest=/درخواست\s*[:：-]?\s*(پرداخت|واریز)|پرداخت\s*[:：-]?\s*(درخواست|جدید)/i.test(text);

        return sender!=="خانم دهقان" &&

               !isPaymentPaid(m) &&

               (txMarker || paymentRequest);

    });

    if(!pending)return;

    if(currentPaymentMessage && String(currentPaymentMessage.id)===String(pending.id)){

        const overlay=document.getElementById("paymentOverlay");

        if(overlay && !overlay.classList.contains("open")){

            showPaymentNotification(pending);

        }

        return;

    }

    const alertKey=String(pending.id||pending.text||"");

    const isNewAlert=localStorage.getItem("jana_last_payment_alert")!==alertKey;

    if(isNewAlert){

        localStorage.setItem("jana_last_payment_alert",alertKey);

        pendingPaymentSound=true;

        playPaymentSound();

    }

    showPaymentNotification(pending);

}

async function confirmPayment(){

    if(!currentPaymentMessage)return;

    const message=currentPaymentMessage;

    const p=parsePaymentMessage(message);

    /*

       کارت را بلافاصله از صفحه جمع می‌کنیم تا UI منتظر رفت‌وبرگشت

       سه درخواست شبکه و رفرش کامل اطلاعات نماند.

    */

    message.paid=true;

    message.payment="پرداخت شد";

    message.read=true;

    allMessages=allMessages.map(m=>String(m.id)===String(message.id)?message:m);

    dismissPayment();

    renderMiniChat();

    showToast("🟢 پرداخت در حال ثبت است...");

    try{

        await cloudPost({action:"setMessagePayment",id:message.id,payment:"پرداخت شد"});

        await cloudPost({action:"markMessageRead",id:message.id,status:"خوانده شد"});

        const confirmation=`🟢 تایید پرداخت | [TX:${p.tx}] | خدمت: ${p.service} | مشتری: ${p.customer} | مبلغ: ${p.amount} | وضعیت: پرداخت شد`;

        await cloudPost({action:"addMessage",sender:"خانم دهقان",text:confirmation,message:confirmation,status:"خوانده نشده",payment:"پرداخت شد"});

        showToast("🟢 پرداخت ثبت شد و تأیید به پنل ثبت ارسال شد.");

    }catch(e){

        console.error(e);

        /* وضعیت واقعی از سرور در polling بعدی دوباره خوانده می‌شود. */

        showToast("⚠️ ثبت پرداخت با مشکل مواجه شد؛ دوباره بررسی می‌شود.");

    }

}

function dismissPayment(){document.getElementById("paymentOverlay")?.classList.remove("open");currentPaymentMessage=null}

function closePaymentFromBackdrop(e){if(e.target.id==="paymentOverlay")dismissPayment()}

function scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}

window.addEventListener("scroll",()=>{const b=document.getElementById("floatingTop");if(b)b.classList.toggle("show",window.scrollY>350);},{passive:true});

document.addEventListener("pointerdown",unlockPaymentAudio,{passive:true});

document.addEventListener("keydown",unlockPaymentAudio,{passive:true});

document.addEventListener("touchstart",unlockPaymentAudio,{passive:true});

/* =====================================================

   START

===================================================== */

applySavedJanaTheme();
updateReportMonthUI();

loadNotes();

showDate();

updateStats();

renderTransactions();

renderNotes();

updateBubble();

drawIncomeChart();

updateMoneyEyes();

loadCloudData();

loadMessages();

/* بروزرسانی سبک و مداوم اطلاعات؛ بدون رفرش صفحه و بدون پرش UI. */

window.janaDataRefreshTimer=setInterval(()=>{

    loadCloudData(false).catch(error=>console.warn("Background refresh failed:",error));

},5000);

messagePollTimer=setInterval(loadMessages,1000);

</script>




</body>

</html>
