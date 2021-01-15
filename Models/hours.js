const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const Hours = sequelize.define('hours', {
        date: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
            // defaultValue: DataTypes.NOW
            // defaultValue: Sequelize.NOW
        },
        clockIn: {
            type: DataTypes.TIME,
            defaultValue: DataTypes.NOW
        },
        clockOut: {
            type: DataTypes.TIME
        },
        shiftLength: {
            // type: DataTypes.DECIMAL(10, 2),
            type: DataTypes.TIME,
            
            get(){
                // return moment(this.getDataValue('clockOut') - this.getDataValue('clockIn')).format('h:mm:ss');
                // return moment(this.clockOut - this.clockIn);

                // if(this.clockOut){
                //     let time = new Date();
                //     // time = this.getDataValue('clockOut') - this.getDataValue('clockIn');
                //     time.setHours(this.getDataValue('clockOut') - this.getDataValue('clockIn'));
                //     // time.setMinutes(this.clockOut.getMinutes() - this.clockIn.getMinutes());
                //     // time.setSeconds(this.clockOut.getSeconds() - this.clockIn.getSeconds());
                //     return time.getHours();
                // }

                // if(this.clockOut){
                //     const timeOut = this.clockOut.split(':');
                //     const timeIn = this.clockIn.split(':');
                //     // return this.clockOut;
                //     const hours = parseInt(timeOut[0]) - parseInt(timeIn[0]);
                //     const minutes = parseInt(timeOut[1]) - parseInt(timeIn[1]);
                //     const seconds = parseInt(timeOut[2]) - parseInt(timeIn[2]);
                //     return `${hours}:${minutes}:${seconds}`;
                // }

                if(this.clockOut){

                    // timeIn = 12:30:00
                    // timeOut = 14:00:00

                    // timeIn 750 (hh*60 + mm)
                    // timeOut 840 (hh*60 + mm)
                    // diff 90 (timeOut - timeIn)
                    // time 1.5 (diff/60)


                    // in = 13:20:00 (1:20)
                    // out = 22:53:00 (10:53)

                    // in 800
                    // out 1373
                    // diff 573
                    // time 9.55

                   const timeIn = this.clockIn.split(':');
                   const timeOut = this.clockOut.split(':');

                   const inTotalMinutes = ((parseInt(timeIn[0]) * 60) + parseInt(timeIn[1]) + (parseInt(timeIn[2]) / 60));
                   const outTotalMinutes = ((parseInt(timeOut[0]) * 60) + parseInt(timeOut[1]) + (parseInt(timeOut[2]) / 60));

                   const diff = outTotalMinutes - inTotalMinutes;

                   const totalTimeInHours = diff / 60;

                    return totalTimeInHours;
                }
                else{
                    const timeIn = new moment(this.clockIn, 'HH:mm:ss');
                    console.log('!!!!!!!!', timeIn);
                    console.log('*****', typeof(timeIn));

                    let date = new Date();
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    return date.getHours();
                }
            }
            // set(){
            //     this.shiftLength = this.clockOut - this.clockIn;
            // }
            
        }
    },
    {timestamps: false});

    return Hours;
}