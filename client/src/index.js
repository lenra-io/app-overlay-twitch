import { LenraApp } from '@lenra/client';

const subsGoal = 15;

const subsProgress = document.getElementById("subsProgress");
subsProgress.querySelector("strong").innerHTML = subsGoal;

const app = new LenraApp({
    clientId: "9f3fbb6c-c865-4d98-b815-4affb3c24bee",
    redirectUri: window.location.href.replace(/\/(index\.html(\?.*))?$/, "/redirect.html"),
    isProd: true,
});

app.connect().then(() => {
    const route = app.route(`/data`, (data) => {
        let outputs = document.getElementsByTagName("output");
        console.log("Received data", data);
        outputs[0].innerHTML = data.lastSubscriber;
        outputs[1].innerHTML = data.lastFollower;
        outputs[2].innerHTML = data.donation;
        outputs[3].innerHTML = data.subscriptionCount;
        subsProgress.style.setProperty('--progress', `${data.subscriptionCount / subsGoal}`);
    });
});
