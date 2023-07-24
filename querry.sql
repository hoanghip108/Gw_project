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

-- Dumping data for table gw_project.category: ~4 rows (approximately)
INSERT INTO `category` (`cateId`, `cateName`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`) VALUES
	('1', 'Instruments', 0, 'ADMIN', '2023-07-24 15:29:05', 'ADMIN', '2023-07-24 15:29:05'),
	('2', 'Music productions', 0, 'ADMIN', '2023-07-24 15:29:05', 'ADMIN', '2023-07-24 15:29:05'),
	('3', 'Music fundamentals', 0, 'ADMIN', '2023-07-24 15:29:05', 'ADMIN', '2023-07-24 15:29:05'),
	('4', 'Vocal', 0, 'ADMIN', '2023-07-24 15:29:05', 'ADMIN', '2023-07-24 15:29:05');

-- Dumping data for table gw_project.course: ~1 rows (approximately)
INSERT INTO `course` (`courseId`, `courseName`, `description`, `price`, `isFree`, `like`, `dislike`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `subCateId`) VALUES
	('86c31e90-2a3d-11ee-ad4f-47b96825e17a', 'Complecteee Guitar Lessons System - Beginner to Advanced', 'All-in-onee Guitar Course, Fingerstyle Guitar, Blues Guitar, Acoustic Guitar, Electric Guitar & Fingerpicking Guitarra', 279, 0, 0, 0, 1, 'hoanghip', '2023-07-24 16:17:03', NULL, '2023-07-24 16:17:39', '1');

-- Dumping data for table gw_project.enrolledcourse: ~0 rows (approximately)

-- Dumping data for table gw_project.lesson: ~0 rows (approximately)

-- Dumping data for table gw_project.permission: ~6 rows (approximately)
INSERT INTO `permission` (`permissionId`, `api`, `canCreate`, `canRead`, `canUpdate`, `canDelete`, `canPatch`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `roleId`) VALUES
	('1', '/users/disable', 1, 1, 1, 1, 1, 0, 'a', '2023-07-09 23:51:32', NULL, NULL, '1'),
	('2', '/users', 1, 1, 1, 1, 1, 1, 'a', '2023-07-23 10:29:40', NULL, NULL, '1'),
	('3', '/courses', 1, 1, 1, 1, 1, 0, 'a', '2023-07-24 23:16:26', NULL, NULL, '3'),
	('4', '/lessons', 1, 1, 1, 1, 1, 0, 'a', '2023-07-24 23:18:28', NULL, NULL, '3'),
	('5', '/lessons', 1, 1, 1, 1, 1, 0, 'a', '2023-07-24 23:19:15', NULL, NULL, '1'),
	('6', '/courses', 1, 1, 1, 1, 1, 0, 'a', '2023-07-24 23:19:42', NULL, NULL, '1');

-- Dumping data for table gw_project.post: ~0 rows (approximately)

-- Dumping data for table gw_project.role: ~3 rows (approximately)
INSERT INTO `role` (`roleId`, `roleName`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`) VALUES
	('1', 'ADMIN', 0, 'ADMIN', '2023-07-24 15:29:05', 'ADMIN', '2023-07-24 15:29:05'),
	('2', 'User', 0, 'ADMIN', '2023-07-24 15:29:05', 'ADMIN', '2023-07-24 15:29:05'),
	('3', 'Lecturer', 0, 'ADMIN', '2023-07-24 15:29:05', 'ADMIN', '2023-07-24 15:29:05');

-- Dumping data for table gw_project.subcategory: ~1 rows (approximately)
INSERT INTO `subcategory` (`subCateId`, `subCateName`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `cateId`) VALUES
	('1', '1', 0, 'a', '2023-07-24 23:14:33', NULL, NULL, '1');

-- Dumping data for table gw_project.user: ~3 rows (approximately)
INSERT INTO `user` (`id`, `username`, `password`, `fullName`, `email`, `phoneNumber`, `avatar`, `isActive`, `bio`, `isDeleted`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `RoleId`) VALUES
	('41c3fd90-2a39-11ee-b90d-6f49e1b64efd', 'hoanghip', '$2b$10$9tWyT1g9Il1IGCKxV3HxBOvZK4BbVHBxEeWzwUc7QLJzo5FDR9A1S', NULL, 'hoaip1008@gmail.com', NULL, NULL, 1, NULL, 0, 'hoanghip', '2023-07-24 15:46:29', NULL, '2023-07-24 15:46:29', '3'),
	('61ebead0-254b-11ee-948c-ab1d31a75561', 'admin1008', '$2b$10$nRCQIJuBZjKouMrfd7qyGe.vf1LSm3nixCcba29o5D3wJrbPYKklK', NULL, 'hoanghip108@gmail.com', NULL, NULL, 1, NULL, 0, 'admin1008', '2023-07-18 09:13:39', NULL, '2023-07-24 15:42:54', '1'),
	('eff25cb0-2555-11ee-8238-d1c992a63ae4', 'hoanghip108', '$2b$10$mP8.t/hDzfwWTNj3MJ0KuOJuBGUGF5chuNUKPU3S7snAfA/eVH.5u', NULL, 'minhbebear309@gmail.com', NULL, NULL, 1, NULL, 0, 'hoanghip108', '2023-07-18 10:29:12', NULL, '2023-07-18 10:29:12', '1');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
