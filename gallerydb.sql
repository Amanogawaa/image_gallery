-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2024 at 05:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gallerydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `image_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `image_id`, `user_id`, `content`, `created_at`) VALUES
(4, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:34'),
(5, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:36'),
(6, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:39'),
(7, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:41'),
(8, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:42'),
(9, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:43'),
(10, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:44'),
(11, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:45'),
(12, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:46'),
(13, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:47'),
(14, 47, 3, 'hahahhahhahhahaha', '2024-08-15 09:10:48'),
(15, 47, 1, 'hello world', '2024-08-15 15:47:30'),
(16, 47, 1, 'edadadadas', '2024-08-15 15:53:51'),
(17, 47, 1, 'edadadadas', '2024-08-15 15:53:51'),
(18, 47, 1, '23123', '2024-08-15 15:54:22'),
(19, 47, 1, 'dasd', '2024-08-15 15:54:35'),
(20, 47, 1, 'dsad', '2024-08-15 15:55:12'),
(21, 47, 1, 'cxc', '2024-08-15 15:55:31'),
(22, 47, 1, 'asd', '2024-08-15 15:56:46'),
(23, 47, 1, 'dasd', '2024-08-15 15:56:57'),
(24, 47, 1, 'das', '2024-08-15 15:57:24'),
(25, 47, 5, 'hell taenamo\n', '2024-08-15 16:04:16'),
(26, 47, 5, 'dasda', '2024-08-15 16:59:52'),
(27, 47, 5, 'dadsadada', '2024-08-15 16:59:56'),
(28, 47, 1, '24231221123321132123213', '2024-08-16 15:21:19'),
(29, 49, 1, 'asdadas', '2024-08-16 15:21:43');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `user_id`, `file_path`, `title`, `description`, `uploaded_at`) VALUES
(47, 2, '../../images/uploads/2024-08-15_17-07-48_Best Fixed Gear Bikes [2023 Review] 8 Cool Fixies For Cheap.jpg', 'Fixie?', 'holy cow', '2024-08-15 09:07:48'),
(48, 5, '../../images/uploads/2024-08-16_01-28-33_edited-image.png', 'wallpaper', '123', '2024-08-15 17:09:59'),
(49, 5, '../../images/uploads/2024-08-16_01-17-56_edited-image.png', 'wallasda', '31231', '2024-08-15 17:11:22'),
(51, 1, '../../images/uploads/2024-08-16_23-25-15_edited-image.png', 'fixie', '213', '2024-08-16 15:23:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `created_at`, `updated_at`) VALUES
(1, 'deainne', '$2y$10$KRZ8V4DCs3ciQ/zEbzFmCOfJdQ9nfeDbd182HWGptJFydNRrsdIjW', 'deainne@gmail.com', '2024-08-10 23:35:54', '2024-08-10 23:35:54'),
(2, 'DumbWyz', '$2y$10$zhGusNjc2WHmt0SprLvRq.tdmpHdZTN1uj2jgi/g1t77PvQVyOAlG', 'deianne@gmail.com', '2024-08-14 15:09:34', '2024-08-14 15:09:34'),
(3, 'estrella_dnd', '$2y$10$ZYEmr7wLoK0Yc8F.F4nL6e0NNu2nNq9TedbRQH1t8dpQH5raafyQu', 'dommolino28@gmail.com', '2024-08-14 15:18:42', '2024-08-14 15:18:42'),
(5, 'DumbWyz123', '$2y$10$QeCsxwBb0MYothFdQ12p9OySV0ZIzPJsla8LrvqclaM4DvL5NKNPu', 'organizer@gmail.com', '2024-08-15 16:03:43', '2024-08-15 16:03:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `image_id` (`image_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
