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

-- Dumping data for table gw_project.bankaccount: ~0 rows (approximately)

-- Dumping data for table gw_project.category: ~4 rows (approximately)
INSERT INTO `category` (`cateId`, `cateName`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`) VALUES
	('1', 'Instruments', 0, 'ADMIN', '2023-07-13 13:55:18', NULL, NULL),
	('2', 'Music productions', 0, 'ADMIN', '2023-07-13 13:55:45', NULL, NULL),
	('3', 'Music fundamentals', 0, 'ADMIN', '2023-07-13 13:56:18', NULL, NULL),
	('4', 'Vocal', 0, 'ADMIN', '2023-07-13 13:56:31', NULL, NULL);

-- Dumping data for table gw_project.course: ~0 rows (approximately)
INSERT INTO `course` (`courseId`, `courseName`, `description`, `price`, `isFree`, `like`, `dislike`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `subCateId`) VALUES
	('66c69e50-215a-11ee-ba41-6183df52c826', 'Complecteee Guitar Lessons System - Beginner to Advanced', 'All-in-onee Guitar Course, Fingerstyle Guitar, Blues Guitar, Acoustic Guitar, Electric Guitar & Fingerpicking Guitarra', 0, 0, 0, 0, 0, 'hoanghip', '2023-07-13 08:51:05', NULL, '2023-07-14 10:06:44', '1');

-- Dumping data for table gw_project.enrolledcourse: ~0 rows (approximately)

-- Dumping data for table gw_project.lesson: ~0 rows (approximately)
INSERT INTO `lesson` (`lessonId`, `lessonName`, `grade`, `videoPath`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `courseId`) VALUES
	('9c6bf600-254b-11ee-9174-e9b6840a2988', 'lesson name', 1, _binary 0x433a5c55736572735c686f616e675c446f63756d656e74735c4769744875625c47775f70726f6a6563745c7372635c766964656f735c4a756a757473752d4b616973656e2d326e642d536561736f6e2e6d7034, 0, 'admin1008', '2023-07-18 09:15:17', NULL, '2023-07-18 09:15:17', '66c69e50-215a-11ee-ba41-6183df52c826');

-- Dumping data for table gw_project.permission: ~2 rows (approximately)
INSERT INTO `permission` (`permissionId`, `api`, `canCreate`, `canRead`, `canUpdate`, `canDelete`, `canPatch`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `roleId`) VALUES
	('1', '/users/disable', 1, 1, 1, 1, 1, 0, 'a', '2023-07-09 23:51:32', NULL, NULL, '1'),
	('2', '/users', 0, 1, 0, 0, 0, 0, 'a', NULL, NULL, NULL, '1');

-- Dumping data for table gw_project.post: ~0 rows (approximately)

-- Dumping data for table gw_project.role: ~2 rows (approximately)
INSERT INTO `role` (`roleId`, `roleName`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`) VALUES
	('1', 'admin', 0, '1', '2023-07-09 23:49:28', NULL, NULL),
	('2', 'user', 0, '1', '2023-07-09 23:50:30', NULL, NULL);

-- Dumping data for table gw_project.subcategory: ~0 rows (approximately)
INSERT INTO `subcategory` (`subCateId`, `subCateName`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `cateId`) VALUES
	('1', 'Guitar', 0, 'ADMIN', '2023-07-13 13:56:53', NULL, NULL, '1');

-- Dumping data for table gw_project.user: ~2 rows (approximately)
INSERT INTO `user` (`id`, `username`, `password`, `fullName`, `email`, `phoneNumber`, `avatar`, `isActive`, `bio`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `RoleId`) VALUES
	('61ebead0-254b-11ee-948c-ab1d31a75561', 'admin1008', '$2b$10$nRCQIJuBZjKouMrfd7qyGe.vf1LSm3nixCcba29o5D3wJrbPYKklK', NULL, 'hoanghip108@gmail.com', NULL, NULL, 1, NULL, 0, 'admin1008', '2023-07-18 09:13:39', NULL, '2023-07-18 09:13:39', '2'),
	('eff25cb0-2555-11ee-8238-d1c992a63ae4', 'hoanghip108', '$2b$10$mP8.t/hDzfwWTNj3MJ0KuOJuBGUGF5chuNUKPU3S7snAfA/eVH.5u', NULL, 'minhbebear309@gmail.com', NULL, NULL, 0, NULL, 0, 'hoanghip108', '2023-07-18 10:29:12', NULL, '2023-07-18 10:29:12', '2');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
