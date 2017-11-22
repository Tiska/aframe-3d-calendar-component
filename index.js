/* global AFRAME */
const moment = require('moment');

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * A-Frame 3D Calendar component for A-Frame.
 */
AFRAME.registerComponent('aframe-3d-calendar-component', {
    schema: {
        locale: {type: 'string', default: 'en'},
        datas: {
            default: [],
            parse: function (value) {
                try{
                    return JSON.parse(value);
                } catch(error){
                    return [];
                }

            }
        },
        color: {type: 'string', default: 'white'},
        colorDays: {type: 'string', default: '#1589CC'},
        mode: {type: 'string', default: 'full'} // full or 3next
    },
    init: function () {

        moment.locale(this.data.locale);

        this.months = [];
        this.monthsReverted = [];
        this.closeButtons = [];
        this.createCalendar();
    },
    remove: function () {
        console.log('remove function calendar called');
        if(this.monthLeft){
            this.el.removeChild(this.monthLeft);
        }
        if(this.monthRight){
            this.el.removeChild(this.monthRight);
        }
        this.clearMonths();
    },
    createCalendarDays: function(monthName, positionPanel, id) {
        if(this.monthLeft && positionPanel === 'left'){
            this.el.removeChild(this.monthLeft);
        }
        if(this.monthRight && positionPanel === 'right'){
            this.el.removeChild(this.monthRight);
        }
        if(positionPanel === 'left'){
            this.monthLeft = document.createElement('a-entity');
            this.monthLeft.setAttribute('geometry', 'primitive: box; width: 5; height: 4.5; depth: 0.1');
            this.monthLeft.setAttribute('position', '3.5 2 0');
            this.monthLeft.setAttribute('rotation', '0 -90 0');
            this.monthLeft.setAttribute('material', 'side: double; color: '+this.data.color+';');
            this.monthLeft.setAttribute('text', 'value: '+monthName+'; zOffset: 0.1; align: center; baseline: top');
            this.monthLeft.setAttribute('id', id);
            this.monthLeft.setAttribute('class', 'select');
            this.initWeeks(this.monthLeft, monthName);
            this.el.appendChild(this.monthLeft);
        }
        if(positionPanel === 'right'){
            this.monthRight = document.createElement('a-entity');
            this.monthRight.setAttribute('geometry', 'primitive: box; width: 5; height: 4.5; depth: 0.1');
            this.monthRight.setAttribute('position', '-3.5 2 0');
            this.monthRight.setAttribute('rotation', '0 90 0');
            this.monthRight.setAttribute('material', 'side: double; color: '+this.data.color+';');
            this.monthRight.setAttribute('text', 'value: '+monthName+'; zOffset: 0.1; align: center; baseline: top');
            this.monthRight.setAttribute('id', id);
            this.monthRight.setAttribute('class', 'select');
            this.initWeeks(this.monthRight, monthName);
            this.el.appendChild(this.monthRight);
        }

    },
    clickCalendarDays3DOpen: function(month, monthReverted) {
        if(month.getAttribute('opened') !== 'true'){
            month.setAttribute('visible', false);
            month.setAttribute('opened', 'true');
            monthReverted.setAttribute('opened', 'true');
            monthReverted.emit('open');
        }
    },
    clickCalendarDays3DClose: function(month, monthReverted) {
        if(month.getAttribute('opened') === 'true'){
            month.setAttribute('opened', 'false');
            monthReverted.setAttribute('opened', 'false');
            monthReverted.emit('close');
        }
    },
    clickCalendarDays3DDisplay: function(month, closeButton) {
        if(month.getAttribute('opened') === 'true'){
            closeButton.setAttribute('visible', true);
        } else {
            month.setAttribute('visible', true);
            closeButton.setAttribute('visible', false);
        }
    },
    createCalendarMonth: function(monthName, position, id, positionPanel) {
        let month = document.createElement('a-entity');
        month.setAttribute('geometry', 'primitive: box; width: 0.8; height: 0.8; depth: 0.1');
        month.setAttribute('position', position);
        month.setAttribute('rotation', '0 180 0');
        month.setAttribute('material', 'side: double; color: '+this.data.color);
        month.setAttribute('text', 'value: '+monthName+'; zOffset: 0.1; align: center; baseline: top; lineHeight: 10; height: 2; width: 2; color: '+ this.data.color);
        month.setAttribute('id', id);
        month.setAttribute('class', 'select');
        month.addEventListener('pressed', function () {
            this.createCalendarDays(monthName, positionPanel, 'days'+positionPanel);
        }.bind(this));
        month.addEventListener('click', function () {
            this.createCalendarDays(monthName, positionPanel, 'days'+positionPanel);
        }.bind(this));
        this.months.push(month);
        this.el.appendChild(month);
    },
    createCalendarMonth3D: function(monthName, position, id, positionOpened, rotationOpened) {
        let month = document.createElement('a-entity');
        month.setAttribute('geometry', 'primitive: box; width: 1; height: 1; depth: 0.1');
        month.setAttribute('position', position);
        month.setAttribute('rotation', '-70 180 0');
        month.setAttribute('material', 'side: double; color: '+this.data.color);
        month.setAttribute('text', 'value: '+monthName+'; zOffset: 0.1; align: center; baseline: top; lineHeight: 20; height: 3; width: 3; font: sourcecodepro; color: '+ this.data.color);
        month.setAttribute('id', id);
        month.setAttribute('class', 'select');
        let monthReverted = document.createElement('a-entity');
        monthReverted.setAttribute('geometry', 'primitive: box; width: 1; height: 1; depth: 0.1');
        monthReverted.setAttribute('position', position);
        monthReverted.setAttribute('rotation', '70 0 0');
        monthReverted.setAttribute('class', 'select');
        monthReverted.setAttribute('material', 'side: double; color: '+this.data.color);
        let closeButton = document.createElement('a-entity');
        closeButton.setAttribute('geometry', 'primitive: triangle');
        closeButton.setAttribute('position', '0 -0.2 0');
        closeButton.setAttribute('class', 'select');
        closeButton.setAttribute('visible', false);
        closeButton.setAttribute('rotation', '180 0 0');
        closeButton.setAttribute('material', 'side: double; color: black;');

        this.createAnimation(monthReverted, rotationOpened, 'open', 'rotation', '70 0 0');

        this.createAnimation(monthReverted, '70 0 0', 'close', 'rotation', rotationOpened);

        this.createAnimation(monthReverted, '6 4 1', 'open','scale');

        this.createAnimation(monthReverted, '1 1 1', 'close','scale');

        this.createAnimation(monthReverted, positionOpened, 'open','position');

        this.createAnimation(monthReverted, position, 'close','position');

        month.addEventListener('pressed', function () {
            this.clickCalendarDays3DOpen(month, monthReverted);
        }.bind(this));
        month.addEventListener('click', function () {
            this.clickCalendarDays3DOpen(month, monthReverted, closeButton);
        }.bind(this));

        closeButton.addEventListener('pressed', function () {
            this.clickCalendarDays3DClose(month, monthReverted, closeButton);
        }.bind(this));
        closeButton.addEventListener('click', function () {
            this.clickCalendarDays3DClose(month, monthReverted, closeButton);
        }.bind(this));

        monthReverted.addEventListener('animationend', function () {
            this.clickCalendarDays3DDisplay(month, closeButton);
        }.bind(this));

        monthReverted.addEventListener('daySelected', function () {
            this.months.map((month,index)=>{
                this.clickCalendarDays3DClose(month, this.monthsReverted[index], this.closeButtons[index]);
        });
        }.bind(this));

        this.initWeeks(monthReverted, monthName, true);
        this.months.push(month);
        this.monthsReverted.push(monthReverted);
        this.closeButtons.push(closeButton);
        monthReverted.appendChild(closeButton);
        this.el.appendChild(month);
        this.el.appendChild(monthReverted);
    },
    createAnimation: function(month, to, begin, animation, from) {
        let monthAnimationRotateOpen = document.createElement('a-animation');
        monthAnimationRotateOpen.setAttribute('attribute', animation);
        monthAnimationRotateOpen.setAttribute('dur', '3000');
        monthAnimationRotateOpen.setAttribute('begin', begin);
        monthAnimationRotateOpen.setAttribute('to', to);
        if(from){
            monthAnimationRotateOpen.setAttribute('from', from);
        }
        month.appendChild(monthAnimationRotateOpen);
    },
    createCalendar: function() {

        let now = moment();

        if(this.data.mode === 'full'){
            let leftPanels = [0,1,2,6,7,8];

            for(let i=0; i<12; i++){
                if(i<6){
                    this.createCalendarMonth(now.format("MMMM"), -(-2.5+i)+' 2.5 2.5', 'month-'+i, leftPanels.indexOf(i)>-1 ? 'left': 'right');
                } else {
                    this.createCalendarMonth(now.format("MMMM"), -(-2.5+i-6)+' 1.5 2.5', 'month-'+i, leftPanels.indexOf(i)>-1 ? 'left': 'right');
                }
                now.add(1, 'months');
            }
        } else {
            this.createCalendarMonth3D(now.format("MMMM"), '1.5 0.5 3', 'month-1', '5.3 3 1', '0 240 0');
            now.add(1, 'months');
            this.createCalendarMonth3D(now.format("MMMM"), '0 0.5 3', 'month-2', '0 3 3.8', '0 180 0');
            now.add(1, 'months');
            this.createCalendarMonth3D(now.format("MMMM"), '-1.5 0.5 3', 'month-3', '-5.3 3 1', '0 120 0');
        }

    },
    initWeeks: function(month, monthName, scaled) {
        month.dayCubes = [];
        let weekdays = moment.weekdays();
        let initWeekDayPosition;
        if(scaled){
            initWeekDayPosition = -0.45;
        } else {
            initWeekDayPosition = -2;
        }
        let weekDaysWithPostions = [];
        for(let weekDay of weekdays){
            let weekDayCube = document.createElement('a-entity');

            if(scaled){
                weekDayCube.setAttribute('geometry', 'primitive: box; width: 0.12; height: 0.1; depth: 0.05');
                weekDayCube.setAttribute('position', initWeekDayPosition+' 0.45 0.1');
                weekDayCube.setAttribute('text', 'value: '+weekDay+'; zOffset: 0.05; align: center; height: 1; width: 0.5; lineHeight: 10; font: exo2bold; color: '+ this.data.color);
            } else {
                weekDayCube.setAttribute('geometry', 'primitive: box; width: 0.6; height: 0.3; depth: 0.05');
                weekDayCube.setAttribute('position', initWeekDayPosition+' 2 0.1');
                weekDayCube.setAttribute('text', 'value: '+weekDay+'; zOffset: 0.05; align: center; height: 3; width: 2.5; lineHeight: 20; font: exo2bold; color: '+ this.data.color);
            }

            weekDayCube.setAttribute('rotation', '0 0 0');
            weekDayCube.setAttribute('material', 'side: double; color: '+this.data.colorDays+';');
            weekDayCube.setAttribute('id', weekDay);
            month.appendChild(weekDayCube);
            month.dayCubes.push(weekDayCube);
            weekDaysWithPostions.push({
                label: weekDay,
                x: initWeekDayPosition
            });
            if(scaled){
                initWeekDayPosition+=0.15;
            } else {
                initWeekDayPosition+=0.68;
            }
        }
        let currentDate = moment().month(monthName);
        if(currentDate.month() < moment().month()){
            currentDate.year(currentDate.year()+1);
        }
        currentDate.date(1);
        let currentWeekDay = moment.weekdays()[currentDate.weekday()+1];
        let currentMonth = currentDate.month();
        let startXPosition;
        let indexPosition = 0;
        weekDaysWithPostions.map((day, index)=>{
            if(day.label === currentWeekDay){
            startXPosition = day.x;
            indexPosition = index;
        }
    });
        let xPostion;
        let yPostion;
        if(scaled){
            xPostion = startXPosition;
            yPostion = 0.3;
        } else {
            xPostion = startXPosition;
            yPostion = 1.4;
        }

        while(currentDate.month() === currentMonth){
            let dayCube = document.createElement('a-entity');
            if(scaled){
                dayCube.setAttribute('geometry', 'primitive: box; width: 0.13; height: 0.13; depth: 0.05');
            } else {
                dayCube.setAttribute('geometry', 'primitive: box; width: 0.6; height: 0.6; depth: 0.05');
            }
            dayCube.setAttribute('position', xPostion+' '+yPostion+' 0.1');
            dayCube.setAttribute('rotation', '0 0 0');
            dayCube.setAttribute('material', 'side: double; color: '+this.data.colorDays+';');

            let text = currentDate.date();
            let dayData;
            if(this.data.datas){
                this.data.datas.map((data)=>{
                    if(moment(data.date).format('YYYY-MM-DD') === currentDate.format('YYYY-MM-DD')){
                    dayData = data.data;
                    text = currentDate.date() + ' \n ' + data.data
                }
            });
            }

            if(scaled){
                dayCube.setAttribute('text', 'value: '+text+'; zOffset: 0.05; align: center; height: 0.6; width: 0.5; lineHeight: 60; font: roboto; wrapCount: 40; color: '+ this.data.color);
            } else {
                dayCube.setAttribute('text', 'value: '+text+'; zOffset: 0.05; align: center; height: 3; width: 2; lineHeight: 60; font: roboto; wrapCount: 40; color: '+ this.data.color);
            }
            dayCube.setAttribute('id', 'day-'+currentDate.date());

            dayCube.addEventListener('pressed', function () {
                if(dayData){
                    dayCube.emit('daySelected', {daySelected: currentDate.format('YYYY-MM-DD')});
                }
            }.bind(this));
            dayCube.addEventListener('click', function () {
                if(dayData){
                    dayCube.emit('daySelected', {daySelected: currentDate.format('YYYY-MM-DD')});
                }
            }.bind(this));

            month.appendChild(dayCube);
            month.dayCubes.push(dayCube);
            if(scaled){
                xPostion+=0.15;
            } else {
                xPostion+=0.68;
            }
            indexPosition++;
            currentDate.add(1, 'days');
            if(indexPosition>6){
                xPostion = weekDaysWithPostions[0].x;
                if(scaled){
                    yPostion-=0.15;
                } else {
                    yPostion-=0.65;
                }
                indexPosition = 0;
            }
        }

    },
    clearMonths: function() {
        for(let monthObject of this.months){
            try{
                this.el.removeChild(monthObject);
            } catch(error){
                try{
                    monthObject.parentNode.removeChild(monthObject);
                } catch(error){

                }
            }
        }
        for(let monthRevertedObject of this.monthsReverted){
            try{
                this.el.removeChild(monthRevertedObject);
            } catch(error){
                try{
                    monthRevertedObject.parentNode.removeChild(monthRevertedObject);
                } catch(error){

                }
            }
        }
        for(let closeObject of this.closeButtons){
            try{
                this.el.removeChild(closeObject);
            } catch(error){
                try{
                    closeObject.parentNode.removeChild(closeObject);
                } catch(error){

                }
            }
        }
    }
});
