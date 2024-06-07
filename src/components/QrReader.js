import React, { useEffect, useRef, useState } from 'react'

// Styles
import './QrStyles.css'

// Qr Scanner
import QrScanner from 'qr-scanner'
import QrFrame from '../assets/qr-frame.svg'

const QrReader = () => {
  // QR States
  const scanner = useRef(null)
  const videoEl = useRef(null)
  const qrBoxEl = useRef(null)
  const [qrOn, setQrOn] = useState(true)
  const [flashOn, setFlashOn] = useState(false)
  const [scannedResult, setScannedResult] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Success
  const onScanSuccess = (result) => {
    console.log(result)
    setScannedResult(result?.data)
  }

  // Fail
  const onScanFail = (err) => {
    console.log(err)
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
      scanner?.current?.stop()
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
      const result = await QrScanner.scanImage(file)
      if (result) {
        onScanSuccess(result)
      }
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="qr-reader">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button onClick={toggleSidebar} className="close-sidebar">
          Close
        </button>
        <label className="upload-label">
          Upload QR Image
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>
      <div className="controls">
        <button
          onClick={toggleSidebar}
          className="control-button menu-button"
        ></button>
        <button className="control-button upload-button">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </button>
        <button
          onClick={toggleFlash}
          className="control-button flash-button"
        ></button>
        <button className="control-button rotate-button"></button>
      </div>
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
      {scannedResult && (
        <p className="scanned-result">Scanned Result: {scannedResult}</p>
      )}
    </div>
  )
}

export default QrReader
