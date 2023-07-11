-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for gw_project
CREATE DATABASE IF NOT EXISTS `gw_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gw_project`;

-- Dumping structure for table gw_project.bankaccount
CREATE TABLE IF NOT EXISTS `bankaccount` (
  `bankAccountId` varchar(255) NOT NULL,
  `accountNumber` int NOT NULL,
  `accountHolder` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `userId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`bankAccountId`),
  KEY `userId` (`userId`),
  CONSTRAINT `bankaccount_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table gw_project.bankaccount: ~0 rows (approximately)

-- Dumping structure for table gw_project.course
CREATE TABLE IF NOT EXISTS `course` (
  `courseId` varchar(255) NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` float NOT NULL,
  `isFree` tinyint(1) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`courseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table gw_project.course: ~0 rows (approximately)

-- Dumping structure for table gw_project.enrolledcourse
CREATE TABLE IF NOT EXISTS `enrolledcourse` (
  `enrolledCourseId` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `CourseCourseId` varchar(255) DEFAULT NULL,
  `userId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`enrolledCourseId`),
  KEY `CourseCourseId` (`CourseCourseId`),
  KEY `userId` (`userId`),
  CONSTRAINT `enrolledcourse_ibfk_1` FOREIGN KEY (`CourseCourseId`) REFERENCES `course` (`courseId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `enrolledcourse_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table gw_project.enrolledcourse: ~0 rows (approximately)

-- Dumping structure for table gw_project.lesson
CREATE TABLE IF NOT EXISTS `lesson` (
  `lessonId` varchar(255) NOT NULL,
  `lessonName` varchar(255) NOT NULL,
  `grade` float DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `CourseCourseId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`lessonId`),
  KEY `CourseCourseId` (`CourseCourseId`),
  CONSTRAINT `lesson_ibfk_1` FOREIGN KEY (`CourseCourseId`) REFERENCES `course` (`courseId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table gw_project.lesson: ~0 rows (approximately)

-- Dumping structure for table gw_project.lessonvideo
CREATE TABLE IF NOT EXISTS `lessonvideo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lessonVideoId` varchar(255) NOT NULL,
  `videoName` varchar(255) NOT NULL,
  `videoPath` blob,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `LessonLessonId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `LessonLessonId` (`LessonLessonId`),
  CONSTRAINT `lessonvideo_ibfk_1` FOREIGN KEY (`LessonLessonId`) REFERENCES `lesson` (`lessonId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table gw_project.lessonvideo: ~0 rows (approximately)

-- Dumping structure for table gw_project.permission
CREATE TABLE IF NOT EXISTS `permission` (
  `permissionId` varchar(255) NOT NULL,
  `api` varchar(255) NOT NULL,
  `canCreate` tinyint(1) DEFAULT '0',
  `canRead` tinyint(1) DEFAULT '0',
  `canUpdate` tinyint(1) DEFAULT '0',
  `canDelete` tinyint(1) DEFAULT '0',
  `canPatch` tinyint(1) DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `RoleRoleId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`permissionId`),
  KEY `RoleRoleId` (`RoleRoleId`),
  CONSTRAINT `permission_ibfk_1` FOREIGN KEY (`RoleRoleId`) REFERENCES `role` (`roleId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table gw_project.permission: ~2 rows (approximately)
INSERT INTO `permission` (`permissionId`, `api`, `canCreate`, `canRead`, `canUpdate`, `canDelete`, `canPatch`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `RoleRoleId`) VALUES
	('1', '/users/disable', 1, 1, 1, 1, 1, 'a', '2023-07-09 23:51:32', NULL, NULL, '1'),
	('2', '/users', 0, 1, 0, 0, 0, 'a', NULL, NULL, NULL, '1');

-- Dumping structure for table gw_project.post
CREATE TABLE IF NOT EXISTS `post` (
  `postId` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `userId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`postId`),
  KEY `userId` (`userId`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table gw_project.post: ~0 rows (approximately)

-- Dumping structure for table gw_project.role
CREATE TABLE IF NOT EXISTS `role` (
  `roleId` varchar(255) NOT NULL,
  `roleName` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table gw_project.role: ~2 rows (approximately)
INSERT INTO `role` (`roleId`, `roleName`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`) VALUES
	('1', 'admin', '1', '2023-07-09 23:49:28', NULL, NULL),
	('2', 'user', '1', '2023-07-09 23:50:30', NULL, NULL);

-- Dumping structure for table gw_project.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(250) NOT NULL,
  `fullName` varchar(250) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `bio` varchar(500) DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `RoleId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `RoleId` (`RoleId`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `role` (`roleId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table gw_project.user: ~4 rows (approximately)
INSERT INTO `user` (`id`, `username`, `password`, `fullName`, `email`, `phoneNumber`, `avatar`, `isActive`, `bio`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `RoleId`) VALUES
	('7a11d870-1f62-11ee-acd8-f967c69966ac', 'hoanghehe', '$2b$10$EMOKI0cQlMkUmSMAwLVzHOrOkc8KmloN6LylEpt4NCws33IYuNL1a', NULL, 'hoad108@gmail.com', NULL, NULL, 0, NULL, 'hoanghehe', '2023-07-10 20:43:51', NULL, '2023-07-10 20:43:51', '2'),
	('87df4810-1e78-11ee-92ea-6d31f345d20b', 'admin', '$2b$10$3igGSEz0CnfIEbF/WvN6WOnZLdhvC3DbooIIO0fGtYFAc57dchl0G', NULL, 'hehe1@gmail.com', NULL, NULL, 1, NULL, 'admin', '2023-07-09 16:49:11', NULL, '2023-07-09 16:49:11', '1'),
	('d492f180-1f62-11ee-a451-a94ccffedfc3', 'hoanaghehe', '$2b$10$zR200c.hLC16CLvjxpIozOrPFjEDV9MmdaewCAgXzuqyWPA7xUx.y', NULL, 'hoad1a08@gmail.com', NULL, NULL, 0, NULL, 'hoanaghehe', '2023-07-10 20:46:22', NULL, '2023-07-10 20:46:22', '2'),
	('fdd14ec0-1f58-11ee-bdf7-192f7294a6bf', 'hoang54hip', '$2b$10$HKfTJdD6OKdiHFS5/mHH4OaElVJ4uCT5baKuPNj7abmV6gTIAAMa.', NULL, 'hoan4511ghip108@gmail.com', NULL, NULL, 0, NULL, 'hoang54hip', '2023-07-10 19:35:57', NULL, '2023-07-10 19:35:57', '2');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
