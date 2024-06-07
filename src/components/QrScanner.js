import React, { useEffect, useRef, useState } from 'react'
import './QrStyles.css'
import QrScanner from 'qr-scanner'
import QrFrame from '../assets/qr-frame.svg'

const QrScanners = () => {
  // QR States
  const scanner = useRef(null)
  const videoEl = useRef(null)
  const qrBoxEl = useRef(null)
  const [qrOn, setQrOn] = useState(true)

  // Result
  const [scannedResult, setScannedResult] = useState('')

  // Success
  const onScanSuccess = (result) => {
    console.log(result)
    setScannedResult(result?.data)
  }

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
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

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false)
        })
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop()
      }
    }
  }, [])

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        'Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.'
      )
  }, [qrOn])

  return (
    <div className="qr-reader">
      {/* QR */}
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>

      {/* Show Data Result if scan is success */}
      {scannedResult && (
        <p
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 99999,
            color: 'white',
          }}
        >
          Scanned Result: {scannedResult}
        </p>
      )}
    </div>
  )
}
export default QrScanners
