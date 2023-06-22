import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { CartBox, globalStyles } from './globalStyle'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { normalize } from './size';
import { COLORS } from './color';
import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';
import { check, request } from 'react-native-permissions';

import { useState } from 'react';



import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import { useEffect } from 'react';

const audioRecorderPlayer = new AudioRecorderPlayer();




const Record = (props) => {


  const sendAudio = (value) => {
    const { updateMasterState } = props;
    updateMasterState(value);
  };


  const path = RNFS.DocumentDirectoryPath + '/audio.mp3';

  const [recordSecs, setrecordsec] = React.useState('');
  const [recordTime, setrecordTime] = React.useState('00:00');
  const [currentPositionSec, setcurrentPositionSec] = React.useState('')
  const [currentDurationSec, setcurrentDurationSec] = React.useState('')
  const [playTime, setplayTime] = React.useState('')
  const [duration, setduration] = React.useState('00:00')
  const [audiorecord, setaudiorecord] = React.useState(false)
  const [playStart, setplaystart] = React.useState(false)
  const [recordStart, setrecordstart] = React.useState(false)



  const [PlayTime2, setPlayTime2] = React.useState("00:00")
  const [RecordTime2, setRecordTime2] = React.useState("00:00")


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  


  audioRecorderPlayer.setSubscriptionDuration(0.09);

  const onStartRecord = async () => {
    // const path = Platform.OS === 'android'
    //   ? '/storage/emulated/0/Download/audio.mp3'
    //   : 'file:///var/mobile/Containers/Data/Application/<app-id>/Library/audio.mp3';
    // console.log(path)


    try {

      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };
      const uri = await audioRecorderPlayer.startRecorder(path, audioSet);

      console.log(uri)
      audioRecorderPlayer.addRecordBackListener((e) => {

        const recordTime = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition))
        const time2 = audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000))

        setRecordTime2(time2);
        setrecordsec(e.currentPosition)
        setrecordTime(recordTime)
        return;

      });

    } catch (error) {

    }


  };



  const onpauseRecord = async () => {

    const result = await audioRecorderPlayer.pauseRecorder();

    console.log(result);

  };

  const onStopRecord = async () => {

    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setrecordsec(0)

    sendAudio(result)
    console.log(result, "stop");

  };





  onDeleteRecord = async () => {



    setaudiorecord(false)

    setcurrentPositionSec(0)
    setcurrentDurationSec(0)
    setplayTime(0)
    setduration('00:00')
    setrecordTime('00:00')
    setRecordTime2("00:00")
    setPlayTime2("00:00")

    sendAudio(null)

  };




  const onStartPlay = async () => {


    console.log('onStartPlay');
    // const path = Platform.OS === 'android'
    //   ? '/storage/emulated/0/Download/audio.mp3'
    //   : 'file:///var/mobile/Containers/Data/Application/<app-id>/Library/audio.mp3';

    const msg = await audioRecorderPlayer.startPlayer(path);

    audioRecorderPlayer.setVolume(1.0);

    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.currentPosition === e.duration) {
        console.log('finished');
        setplaystart(false)
        audioRecorderPlayer.stopPlayer();
      }
      setcurrentPositionSec(e.currentPosition)
      setcurrentDurationSec(e.duration)
      const playtime = audioRecorderPlayer.mmss(Math.floor(e.currentPosition /1000))
      setPlayTime2(playtime);
      setplayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)))
      setduration(audioRecorderPlayer.mmssss(Math.floor(e.duration)))


      return;

    });

  };






  const onPausePlay = async () => {

    const msg = await audioRecorderPlayer.pausePlayer((e) => {
      const playtime = audioRecorderPlayer.mmss(Math.floor(e.currentPosition /1000))
      setPlayTime2(playtime);
  
    }



    );

    console.log(msg);




  };




  onStopPlay = async () => {


    audioRecorderPlayer.stopPlayer();

    audioRecorderPlayer.removePlayBackListener();

  };













  return (

    <View style={{ marginTop: 15 }}>
      <CartBox>
        <View style={{ flexDirection: "row" }}>
          <Text style={[{ width: "50%", color: COLORS.appOppsiteTextColor }]}>
            Delivery notes by customer goes here
          </Text>
          

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "50%" }}>

            {!audiorecord ?
              <Text style={[globalStyles.cart_heading1, {}]}>{RecordTime2}</Text>
              :
              // <Text style={[globalStyles.cart_heading1, {}]}>{playTime} </Text>
              <>
                {playStart ?
              
                  <Text style={[globalStyles.cart_heading1, {}]}>{PlayTime2}</Text>
                  :
                  <Text style={[globalStyles.cart_heading1, {}]}>{RecordTime2}</Text>
                  
                }
              </>

            }




            {!audiorecord ?


              <>


                {!recordStart ?
                  <TouchableOpacity onPress={() => { onStartRecord(); setrecordstart(true) }} style={{ backgroundColor: "white", width: 40, height: 40, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="mic" size={normalize(25)} color="#64748B" />
                  </TouchableOpacity>
                  :


                  <>
                    {/* 
                    <TouchableOpacity onPress={() => { onpauseRecord(); }} style={{ backgroundColor: "white", width: 40, height: 40, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                      <Ionicons name="pause" size={normalize(25)} color="#71D67A" />
                    </TouchableOpacity> */}


                    <TouchableOpacity  onPress={() => { onStopRecord(); setrecordstart(false); setaudiorecord(true) }} style={{ backgroundColor: "white", width: 40, height: 40, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                      <Ionicons name="stop" size={normalize(25)} color="red" />
                    </TouchableOpacity>


                  </>

                }
              </>

              :

              <>
                {playStart ?
                  <TouchableOpacity onPress={() => { onPausePlay(); setplaystart(false) }} style={{ backgroundColor: "white", width: 40, height: 40, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="pause" size={normalize(25)} color="#71D67A" />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => { onStartPlay(); setplaystart(true) }} style={{ backgroundColor: "white", width: 40, height: 40, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="play" size={normalize(25)} color="#71D67A" />
                  </TouchableOpacity>

                }


                <TouchableOpacity onPress={() => onDeleteRecord()} style={{ backgroundColor: "white", width: 40, height: 40, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                  <MaterialCommunityIcons name="delete" size={normalize(25)} color="#FF5D5D" />
                </TouchableOpacity>

              </>
            }



          </View>
        </View>

      </CartBox>
    </View>

  )

}




export default Record



