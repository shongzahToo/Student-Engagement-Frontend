import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

import { checkUserIn } from "../../Tools/MockAPI/FakeAPI.jsx";
import "./ScanUsers.css";

function ScanUsers() {
    const { id } = useParams();
    const scannerRef = useRef(null);
    const lastScanRef = useRef("");
    const [scanStatus, setScanStatus] = useState("Ready to scan");
    const [scannedUserId, setScannedUserId] = useState(null);
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: (viewfinderWidth, viewfinderHeight) => {
                    const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.75;
                    return {
                        width: Math.floor(size),
                        height: Math.floor(size)
                    };
                },
                rememberLastUsedCamera: true,
                supportedScanTypes: []
            },
            false
        );

        scanner.render(
            async (decodedText) => {
                const userId = decodedText.trim();

                if (!userId || userId === lastScanRef.current || isCheckingIn) return;

                lastScanRef.current = userId;
                setScannedUserId(userId);
                setIsCheckingIn(true);
                setScanStatus("Checking user in...");

                try {
                    await checkUserIn(id, userId);
                    setScanStatus(`User ${userId} checked in successfully.`);
                } catch (error) {
                    console.error(error);
                    setScanStatus("Check-in failed. Please try again.");
                    lastScanRef.current = "";
                } finally {
                    setIsCheckingIn(false);

                    setTimeout(() => {
                        lastScanRef.current = "";
                        setScannedUserId(null);
                        setScanStatus("Ready to scan");
                    }, 2500);
                }
            },
            () => {
            }
        );

        scannerRef.current = scanner;

        return () => {
            scanner.clear().catch(() => {});
        };
    }, [id, isCheckingIn]);

    return (
        <section className="scan-page">
            <div className="scan-panel">
                <div className="scan-content">
                    <p className="scan-eyebrow">Event Check-In</p>

                    <h1 className="scan-title">
                        Scan attendee
                        <br />
                        <em>QR code.</em>
                    </h1>

                    <p className="scan-subtitle">
                        Use a phone, tablet, or computer camera to scan the QR code.
                        The scanned user ID will be checked into this event automatically.
                    </p>

                    <div className={`scan-status ${isCheckingIn ? "loading" : ""}`}>
                        {scanStatus}
                    </div>

                    {scannedUserId && (
                        <div className="scan-result">
                            Last scanned user: <strong>{scannedUserId}</strong>
                        </div>
                    )}
                </div>

                <div className="scanner-card">
                    <div id="qr-reader" />
                </div>
            </div>
        </section>
    );
}

export default ScanUsers;