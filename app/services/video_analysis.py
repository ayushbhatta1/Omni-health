import cv2
import numpy as np
import torch
from ultralytics import YOLO
import mediapipe as mp
from typing import Dict, List, Optional, Tuple
import logging
from pathlib import Path
import tempfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VideoAnalysisService:
    def __init__(self):
        self.models = {}
        self.initialize_models()
        
    def initialize_models(self):
        """Initialize video analysis models"""
        try:
            # Initialize YOLOv8 for general object detection
            self.models['yolo'] = YOLO('yolov8n.pt')
            
            # Initialize MediaPipe for pose and face detection
            self.mp_pose = mp.solutions.pose
            self.mp_face = mp.solutions.face_mesh
            self.pose = self.mp_pose.Pose(
                static_image_mode=False,
                model_complexity=2,
                min_detection_confidence=0.5
            )
            self.face = self.mp_face.FaceMesh(
                static_image_mode=False,
                max_num_faces=1,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
            
            logger.info("Video analysis models initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing video models: {str(e)}")
            raise

    def analyze_gait(self, frame: np.ndarray) -> Dict:
        """Analyze gait patterns for neurological conditions"""
        try:
            # Convert to RGB for MediaPipe
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Get pose landmarks
            results = self.pose.process(frame_rgb)
            
            if not results.pose_landmarks:
                return {
                    "gait_patterns": {
                        "stride_length": "unknown",
                        "gait_symmetry": "unknown",
                        "posture": "unknown"
                    },
                    "potential_conditions": []
                }
            
            # Extract key points for gait analysis
            landmarks = results.pose_landmarks.landmark
            
            # Calculate stride length (simplified)
            left_heel = landmarks[self.mp_pose.PoseLandmark.LEFT_HEEL]
            right_heel = landmarks[self.mp_pose.PoseLandmark.RIGHT_HEEL]
            stride_length = np.sqrt(
                (left_heel.x - right_heel.x)**2 + 
                (left_heel.y - right_heel.y)**2
            )
            
            # Analyze posture
            left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER]
            left_hip = landmarks[self.mp_pose.PoseLandmark.LEFT_HIP]
            right_hip = landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP]
            
            # Calculate shoulder and hip alignment
            shoulder_alignment = abs(left_shoulder.y - right_shoulder.y)
            hip_alignment = abs(left_hip.y - right_hip.y)
            
            # Determine posture
            if shoulder_alignment > 0.1 or hip_alignment > 0.1:
                posture = "asymmetric"
            else:
                posture = "symmetric"
            
            return {
                "gait_patterns": {
                    "stride_length": float(stride_length),
                    "gait_symmetry": "symmetric" if stride_length > 0.1 else "asymmetric",
                    "posture": posture
                },
                "potential_conditions": self._analyze_gait_conditions(
                    stride_length, posture, shoulder_alignment, hip_alignment
                )
            }
        except Exception as e:
            logger.error(f"Error analyzing gait: {str(e)}")
            raise

    def analyze_facial_movements(self, frame: np.ndarray) -> Dict:
        """Analyze facial movements for neurological conditions"""
        try:
            # Convert to RGB for MediaPipe
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Get face landmarks
            results = self.face.process(frame_rgb)
            
            if not results.multi_face_landmarks:
                return {
                    "facial_patterns": {
                        "symmetry": "unknown",
                        "tremors": "unknown",
                        "expression": "unknown"
                    },
                    "potential_conditions": []
                }
            
            # Analyze facial symmetry and movements
            face_landmarks = results.multi_face_landmarks[0].landmark
            
            # Calculate facial symmetry
            left_eye = face_landmarks[33]  # Left eye corner
            right_eye = face_landmarks[263]  # Right eye corner
            nose_tip = face_landmarks[1]  # Nose tip
            
            # Calculate symmetry metrics
            eye_distance = abs(left_eye.x - right_eye.x)
            face_symmetry = "symmetric" if eye_distance < 0.1 else "asymmetric"
            
            # Detect tremors (simplified)
            # In a real implementation, you would track landmark movements over time
            tremors = "none"
            
            return {
                "facial_patterns": {
                    "symmetry": face_symmetry,
                    "tremors": tremors,
                    "expression": "neutral"  # TODO: Implement expression detection
                },
                "potential_conditions": self._analyze_facial_conditions(
                    face_symmetry, tremors
                )
            }
        except Exception as e:
            logger.error(f"Error analyzing facial movements: {str(e)}")
            raise

    def analyze_video(self, video_path: str) -> Dict:
        """
        Main method to analyze video for health-related patterns
        """
        try:
            # Open video file
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError("Could not open video file")
            
            # Initialize analysis results
            gait_results = []
            facial_results = []
            frame_count = 0
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Analyze every 5th frame to reduce processing time
                if frame_count % 5 == 0:
                    # Analyze gait
                    gait_analysis = self.analyze_gait(frame)
                    gait_results.append(gait_analysis)
                    
                    # Analyze facial movements
                    facial_analysis = self.analyze_facial_movements(frame)
                    facial_results.append(facial_analysis)
                
                frame_count += 1
            
            cap.release()
            
            # Aggregate results
            results = {
                "gait_analysis": self._aggregate_gait_results(gait_results),
                "facial_analysis": self._aggregate_facial_results(facial_results),
                "recommendations": self._generate_recommendations(
                    gait_results, facial_results
                )
            }
            
            return results
            
        except Exception as e:
            logger.error(f"Error in video analysis: {str(e)}")
            raise

    def _analyze_gait_conditions(
        self,
        stride_length: float,
        posture: str,
        shoulder_alignment: float,
        hip_alignment: float
    ) -> List[str]:
        """Analyze gait patterns for potential conditions"""
        conditions = []
        
        if stride_length < 0.05:
            conditions.append("Possible Parkinson's disease (shuffling gait)")
        
        if posture == "asymmetric":
            if shoulder_alignment > 0.15:
                conditions.append("Possible stroke or hemiplegia")
            if hip_alignment > 0.15:
                conditions.append("Possible hip joint problems or leg length discrepancy")
        
        return conditions

    def _analyze_facial_conditions(
        self,
        face_symmetry: str,
        tremors: str
    ) -> List[str]:
        """Analyze facial patterns for potential conditions"""
        conditions = []
        
        if face_symmetry == "asymmetric":
            conditions.append("Possible Bell's palsy or stroke")
        
        if tremors != "none":
            conditions.append("Possible essential tremor or Parkinson's disease")
        
        return conditions

    def _aggregate_gait_results(self, results: List[Dict]) -> Dict:
        """Aggregate gait analysis results across frames"""
        if not results:
            return {
                "gait_patterns": {
                    "stride_length": "unknown",
                    "gait_symmetry": "unknown",
                    "posture": "unknown"
                },
                "potential_conditions": []
            }
        
        # Calculate average stride length
        stride_lengths = [r["gait_patterns"]["stride_length"] 
                         for r in results 
                         if r["gait_patterns"]["stride_length"] != "unknown"]
        avg_stride = np.mean(stride_lengths) if stride_lengths else "unknown"
        
        # Determine most common posture
        postures = [r["gait_patterns"]["posture"] 
                   for r in results 
                   if r["gait_patterns"]["posture"] != "unknown"]
        most_common_posture = max(set(postures), key=postures.count) if postures else "unknown"
        
        # Collect all potential conditions
        all_conditions = []
        for r in results:
            all_conditions.extend(r["potential_conditions"])
        
        return {
            "gait_patterns": {
                "stride_length": float(avg_stride) if avg_stride != "unknown" else "unknown",
                "gait_symmetry": "symmetric" if avg_stride > 0.1 else "asymmetric",
                "posture": most_common_posture
            },
            "potential_conditions": list(set(all_conditions))
        }

    def _aggregate_facial_results(self, results: List[Dict]) -> Dict:
        """Aggregate facial analysis results across frames"""
        if not results:
            return {
                "facial_patterns": {
                    "symmetry": "unknown",
                    "tremors": "unknown",
                    "expression": "unknown"
                },
                "potential_conditions": []
            }
        
        # Determine most common patterns
        symmetries = [r["facial_patterns"]["symmetry"] 
                     for r in results 
                     if r["facial_patterns"]["symmetry"] != "unknown"]
        most_common_symmetry = max(set(symmetries), key=symmetries.count) if symmetries else "unknown"
        
        tremors = [r["facial_patterns"]["tremors"] 
                  for r in results 
                  if r["facial_patterns"]["tremors"] != "unknown"]
        most_common_tremors = max(set(tremors), key=tremors.count) if tremors else "unknown"
        
        # Collect all potential conditions
        all_conditions = []
        for r in results:
            all_conditions.extend(r["potential_conditions"])
        
        return {
            "facial_patterns": {
                "symmetry": most_common_symmetry,
                "tremors": most_common_tremors,
                "expression": "neutral"  # TODO: Implement expression aggregation
            },
            "potential_conditions": list(set(all_conditions))
        }

    def _generate_recommendations(
        self,
        gait_results: List[Dict],
        facial_results: List[Dict]
    ) -> List[str]:
        """Generate recommendations based on analysis results"""
        recommendations = []
        
        # Gait-related recommendations
        gait_conditions = set()
        for result in gait_results:
            gait_conditions.update(result["potential_conditions"])
        
        if "Possible Parkinson's disease" in gait_conditions:
            recommendations.append(
                "Gait analysis suggests possible Parkinson's disease. "
                "Please consult a neurologist for proper evaluation."
            )
        
        if "Possible stroke" in gait_conditions:
            recommendations.append(
                "Gait analysis suggests possible stroke. "
                "Please seek immediate medical attention."
            )
        
        # Facial-related recommendations
        facial_conditions = set()
        for result in facial_results:
            facial_conditions.update(result["potential_conditions"])
        
        if "Possible Bell's palsy" in facial_conditions:
            recommendations.append(
                "Facial analysis suggests possible Bell's palsy. "
                "Please consult a neurologist for proper evaluation."
            )
        
        if "Possible essential tremor" in facial_conditions:
            recommendations.append(
                "Facial analysis suggests possible essential tremor. "
                "Please consult a neurologist for proper evaluation."
            )
        
        return recommendations 