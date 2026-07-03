import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Asset } from 'expo-asset';
import RNFetchBlob from 'react-native-blob-util';
import { problemFileMap } from '../data/problemFileMap';

const OriginalProblemScreen = ({ route }) => {
  const { year, month, grade } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);

  const key = `${year}_${String(month).padStart(2, '0')}_${grade}`;
  const pdfSource = problemFileMap[key];

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to download files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS에서는 별도 권한 요청 필요 없음
  };

  const downloadPdf = async () => {
    setMenuVisible(false);
    if (!(await requestStoragePermission())) {
      console.log('Storage permission denied');
      alert('다운로드를 위해 저장소 접근 권한이 필요합니다.');
      return;
    }

    try {
      const asset = Asset.fromModule(pdfSource);
      await asset.downloadAsync(); // Make sure asset is downloaded to cache

      const { dirs } = RNFetchBlob.fs;
      const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
      const fileName = `${key}_problem.pdf`;
      const filePath = `${dirToSave}/${fileName}`;

      await RNFetchBlob.fs.cp(asset.localUri, filePath);

      if (Platform.OS === 'android') {
        RNFetchBlob.android.addCompleteDownload({
          title: fileName,
          description: 'Download complete',
          mime: 'application/pdf',
          path: filePath,
          showNotification: true,
        });
      }

      alert('다운로드가 완료되었습니다.');
    } catch (error) {
      console.error(error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  if (!pdfSource) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          해당하는 문제지 PDF 파일을 찾을 수 없습니다.
        </Text>
        <Text style={styles.details}>
          요청: {year}년 {month}월 {grade}학년
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/*
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.menuButton}
        >
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </TouchableOpacity>
        */}
      </View>

      <Pdf
        trustAllCerts={false}
        source={pdfSource}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`PDF 로딩 완료: ${numberOfPages} 페이지`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        style={styles.pdf}
      />

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisiHomepageble(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <TouchableOpacity onPress={downloadPdf} style={styles.menuItem}>
                <Text style={styles.menuItemText}>다운로드하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50, // Adjusted for better placement
    right: 15,
    zIndex: 1,
  },
  menuButton: {
    padding: 10,
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: 'black',
    borderRadius: 2,
    marginVertical: 2,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginTop: 80,
    marginRight: 20,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default OriginalProblemScreen;