import React, { useEffect, useRef, useState } from 'react'
import './QrStyles.css'
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

  // Success
  const onScanSuccess = (result) => {
    // Print the "result" to browser console.
    console.log('Scanned result:', result)
    // Handle success.
    // You can do whatever you want with the scanned result.
    setScannedResult(result?.data || result)
  }

  // Fail
  const onScanFail = (err) => {
    // Print the "err" to browser console.
    console.log('Scan error:', err)
  }

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      })

      // Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false)
        })
    }

    // Clean up on unmount.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop()
      }
    }
  }, [])

  // If "camera" is not allowed in browser permissions, show an alert.
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
    <div className="qr-reader">
      <div className="controls">
        <label className="control-button upload-button">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        <button
          onClick={toggleFlash}
          className="control-button flash-button"
        ></button>
        <button className="control-button rotate-button"></button>
      </div>
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
  )
}

export default QrReader
