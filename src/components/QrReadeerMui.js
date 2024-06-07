import React, { useEffect, useRef, useState } from 'react'
import './QrStyles.css'
import 'react-pro-sidebar/dist/css/styles.css'
import QrScanner from 'qr-scanner'
import QrFrame from '../assets/qr-frame.svg'
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'
import MenuIcon from '@mui/icons-material/Menu'
import UploadIcon from '@mui/icons-material/Upload'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import FlashOffIcon from '@mui/icons-material/FlashOff'
import RotateRightIcon from '@mui/icons-material/RotateRight'

const QrReader = () => {
  // QR States
  const scanner = useRef(null)
  const videoEl = useRef(null)
  const qrBoxEl = useRef(null)
  const [qrOn, setQrOn] = useState(true)
  const [flashOn, setFlashOn] = useState(false)
  const [scannedResult, setScannedResult] = useState('')

  // Success
  const onScanSuccess = (result) => {
    console.log('Scanned result:', result)
    setScannedResult(result?.data || result)
  }

  // Fail
  const onScanFail = (err) => {
    console.log('Scan error:', err)
  }

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      })

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false)
        })
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop()
      }
    }
  }, [])

  useEffect(() => {
    if (!qrOn)
      alert(
        'Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.'
      )
  }, [qrOn])

  const toggleFlash = async () => {
    if (scanner.current) {
      if (flashOn) {
        await scanner.current.toggleFlash(false)
        setFlashOn(false)
      } else {
        await scanner.current.toggleFlash(true)
        setFlashOn(true)
      }
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const result = await QrScanner.scanImage(file)
        console.log('Uploaded image scan result:', result)
        if (result) {
          onScanSuccess(result)
        }
      } catch (error) {
        console.error('Error scanning uploaded image:', error)
        onScanFail(error)
      }
    }
  }

  return (
    <div className="qr-app">
      <ProSidebar>
        <SidebarHeader>
          <Menu iconShape="square">
            <MenuItem icon={<MenuIcon />}>Menu</MenuItem>
          </Menu>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
            <MenuItem icon={<UploadIcon />}>
              <label className="upload-button">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </MenuItem>
            <MenuItem
              icon={flashOn ? <FlashOffIcon /> : <FlashOnIcon />}
              onClick={toggleFlash}
            >
              {flashOn ? 'Flash Off' : 'Flash On'}
            </MenuItem>
            <MenuItem icon={<RotateRightIcon />}>Rotate</MenuItem>
          </Menu>
        </SidebarContent>
      </ProSidebar>
      <div className="qr-reader">
        <div className="video-container">
          <video ref={videoEl} className="qr-video"></video>
          <div ref={qrBoxEl} className="qr-box">
            <img
              src={QrFrame}
              alt="Qr Frame"
              width={256}
              height={256}
              className="qr-frame"
            />
          </div>
        </div>
        {scannedResult && (
          <p className="scanned-result">Scanned Result: {scannedResult}</p>
        )}
      </div>
    </div>
  )
}

export default QrReader
