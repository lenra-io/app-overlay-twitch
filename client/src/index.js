import { LenraApp } from '@lenra/client';

const app = new LenraApp({
    clientId: "XXX-XXX-XXX",
});

app.connect().then(() => {
    const route = app.route(`/events`, (data) => {
        let outputs = document.getElementsByTagName("output");
        outputs[0].innerHTML = data.value.lastSubscriber;
        outputs[1].innerHTML = data.value.lastFollower;
        outputs[2].innerHTML = data.value.donation;
        outputs[3].innerHTML = data.value.subscriptionCount;
    });
});