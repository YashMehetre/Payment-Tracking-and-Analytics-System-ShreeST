-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 03, 2023 at 06:05 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sst_erp`
--

-- --------------------------------------------------------

--
-- Table structure for table `billdetails`
--

CREATE TABLE `billdetails` (
  `billNum` int(11) NOT NULL,
  `vendorId` int(11) NOT NULL,
  `billDate` date NOT NULL,
  `billGoodsType` varchar(12) NOT NULL,
  `billTotalBoxes` int(11) NOT NULL,
  `billWeightPerBox` float NOT NULL,
  `billTotalWeight` float NOT NULL,
  `billMarketAmount` int(11) NOT NULL,
  `billPaymentAmount` int(11) NOT NULL,
  `billMoreDetails` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Table to store the details Bill wise';

--
-- Dumping data for table `billdetails`
--

-- --------------------------------------------------------

--
-- Table structure for table `paymentdetails`
--

CREATE TABLE `paymentdetails` (
  `paymentId` int(11) NOT NULL,
  `vendorId` int(11) NOT NULL,
  `paymentModeId` int(11) NOT NULL,
  `paymentDate` date NOT NULL DEFAULT current_timestamp(),
  `paymentReceivedAmt` int(11) NOT NULL,
  `paymentMoreDetails` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paymentdetails`
--

-- --------------------------------------------------------

--
-- Table structure for table `paymentmode`
--

CREATE TABLE `paymentmode` (
  `paymentModeId` int(11) NOT NULL,
  `paymentModeName` varchar(64) NOT NULL,
  `paymentModeDetails` varchar(255) DEFAULT NULL,
  `paymentModeStatus` varchar(16) NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paymentmode`
--

-- --------------------------------------------------------

--
-- Table structure for table `vendordetails`
--

CREATE TABLE `vendordetails` (
  `vendorId` int(11) NOT NULL,
  `vendorFirm` varchar(255) NOT NULL,
  `vendorName` varchar(255) DEFAULT NULL,
  `firmGSTNum` varchar(15) DEFAULT NULL,
  `vendorContact1` varchar(10) NOT NULL,
  `vendorContact2` varchar(10) NOT NULL,
  `vendorEmail` varchar(255) NOT NULL,
  `vendorAddress` varchar(255) NOT NULL,
  `goodsType` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendordetails`
--



--
-- Indexes for dumped tables
--

--
-- Indexes for table `billdetails`
--
ALTER TABLE `billdetails`
  ADD PRIMARY KEY (`billNum`),
  ADD KEY `vendorId` (`vendorId`);

--
-- Indexes for table `paymentdetails`
--
ALTER TABLE `paymentdetails`
  ADD PRIMARY KEY (`paymentId`),
  ADD KEY `vendorID` (`vendorId`),
  ADD KEY `paymentModeID` (`paymentModeId`);

--
-- Indexes for table `paymentmode`
--
ALTER TABLE `paymentmode`
  ADD PRIMARY KEY (`paymentModeId`);

--
-- Indexes for table `vendordetails`
--
ALTER TABLE `vendordetails`
  ADD PRIMARY KEY (`vendorId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `billdetails`
--
ALTER TABLE `billdetails`
  MODIFY `billNum` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `paymentdetails`
--
ALTER TABLE `paymentdetails`
  MODIFY `paymentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `paymentmode`
--
ALTER TABLE `paymentmode`
  MODIFY `paymentModeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vendordetails`
--
ALTER TABLE `vendordetails`
  MODIFY `vendorId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billdetails`
--
ALTER TABLE `billdetails`
  ADD CONSTRAINT `billdetails_ibfk_1` FOREIGN KEY (`vendorId`) REFERENCES `vendordetails` (`vendorId`);

--
-- Constraints for table `paymentdetails`
--
ALTER TABLE `paymentdetails`
  ADD CONSTRAINT `paymentdetails_ibfk_1` FOREIGN KEY (`vendorID`) REFERENCES `vendordetails` (`vendorId`),
  ADD CONSTRAINT `paymentdetails_ibfk_2` FOREIGN KEY (`paymentModeID`) REFERENCES `paymentmode` (`paymentModeID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
