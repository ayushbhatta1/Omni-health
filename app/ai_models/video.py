import cv2
import numpy as np
import mediapipe as mp
from ultralytics import YOLO

class VideoAnalyzer:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.mp_face = mp.solutions.face_mesh
        self.pose = self.mp_pose.Pose()
        self.face = self.mp_face.FaceMesh()
        self.yolo_model = YOLO('yolov8n.pt')
        
    def analyze_video(self, video_path):
        """
        Analyze video for medical conditions
        """
        try:
            cap = cv2.VideoCapture(video_path)
            frames = []
            pose_data = []
            face_data = []
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                    
                # Convert to RGB for MediaPipe
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Analyze pose
                pose_results = self.pose.process(rgb_frame)
                if pose_results.pose_landmarks:
                    pose_data.append(pose_results.pose_landmarks.landmark)
                
                # Analyze face
                face_results = self.face.process(rgb_frame)
                if face_results.multi_face_landmarks:
                    face_data.append(face_results.multi_face_landmarks[0].landmark)
                
                frames.append(frame)
            
            cap.release()
            
            # Run YOLO on key frames
            key_frames = frames[::30]  # Sample every 30th frame
            detections = []
            for frame in key_frames:
                results = self.yolo_model(frame)
                detections.append(results[0].boxes.data.tolist())
            
            analysis = {
                "pose_data": pose_data,
                "face_data": face_data,
                "detections": detections,
                "frame_count": len(frames)
            }
            
            return analysis
            
        except Exception as e:
            return {"error": str(e)}
            
    def analyze_gait(self, video_path):
        """
        Analyze walking patterns
        """
        try:
            cap = cv2.VideoCapture(video_path)
            gait_data = []
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                    
                # Convert to RGB for MediaPipe
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Analyze pose for gait
                pose_results = self.pose.process(rgb_frame)
                if pose_results.pose_landmarks:
                    gait_data.append(pose_results.pose_landmarks.landmark)
            
            cap.release()
            
            return {"status": "success", "gait_patterns": gait_data}
            
        except Exception as e:
            return {"error": str(e)}
            
    def analyze_facial_movements(self, video_path):
        """
        Analyze facial movements for neurological conditions
        """
        try:
            cap = cv2.VideoCapture(video_path)
            facial_data = []
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                    
                # Convert to RGB for MediaPipe
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Analyze face
                face_results = self.face.process(rgb_frame)
                if face_results.multi_face_landmarks:
                    facial_data.append(face_results.multi_face_landmarks[0].landmark)
            
            cap.release()
            
            return {"status": "success", "facial_patterns": facial_data}
            
        except Exception as e:
            return {"error": str(e)} 