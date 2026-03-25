--======================================
-- RENTAL_COMPANY
-- =====================================
INSERT INTO RENTAL_COMPANY VALUES
(1,'Hertz','+972501111111','hertz@mail.com'),
(2,'Avis','+972502222222','avis@mail.com'),
(3,'Budget','+972503333333','budget@mail.com'),
(4,'Sixt','+972504444444','sixt@mail.com'),
(5,'Enterprise','+972505555555','enterprise@mail.com'),
(6,'Europcar','+972506666666','europcar@mail.com'),
(7,'Alamo','+972507777777','alamo@mail.com'),
(8,'Thrifty','+972508888888','thrifty@mail.com'),
(9,'Dollar','+972509999999','dollar@mail.com'),
(10,'National','+972501010101','national@mail.com'),
(11,'GreenMotion','+972501212121','green@mail.com'),
(12,'GoldCar','+972502323232','gold@mail.com'),
(13,'SilverDrive','+972503434343','silver@mail.com'),
(14,'RentGo','+972504545454','rentgo@mail.com'),
(15,'DriveMax','+972505656565','drivemax@mail.com'),
(16,'AutoWorld','+972506767676','auto@mail.com'),
(17,'CarExpress','+972507878787','express@mail.com'),
(18,'CityCars','+972508989898','city@mail.com'),
(19,'TravelDrive','+972509090909','travel@mail.com'),
(20,'QuickCar','+972500101010','quick@mail.com');

-- =====================================
-- LOCATION
-- =====================================
INSERT INTO LOCATION VALUES
(1,'Tel Aviv','Ben Yehuda 1','Israel',32.0853,34.7818),
(2,'Jerusalem','Jaffa 10','Israel',31.7683,35.2137),
(3,'Haifa','Herzl 5','Israel',32.7940,34.9896),
(4,'Eilat','Derech HaArava','Israel',29.5577,34.9519),
(5,'Paris','Champs Elysees','France',48.8566,2.3522),
(6,'Lyon','Center','France',45.7640,4.8357),
(7,'Berlin','Alexanderplatz','Germany',52.5200,13.4050),
(8,'Munich','Marienplatz','Germany',48.1351,11.5820),
(9,'Rome','Via Roma','Italy',41.9028,12.4964),
(10,'Milan','Duomo','Italy',45.4642,9.1900),
(11,'New York','Manhattan','USA',40.7128,-74.0060),
(12,'Los Angeles','Hollywood','USA',34.0522,-118.2437),
(13,'London','Oxford St','UK',51.5074,-0.1278),
(14,'Manchester','Center','UK',53.4808,-2.2426),
(15,'Madrid','Gran Via','Spain',40.4168,-3.7038),
(16,'Barcelona','La Rambla','Spain',41.3851,2.1734),
(17,'Tokyo','Shinjuku','Japan',35.6895,139.6917),
(18,'Osaka','Namba','Japan',34.6937,135.5023),
(19,'Dubai','Downtown','UAE',25.2048,55.2708),
(20,'Abu Dhabi','Corniche','UAE',24.4539,54.3773);

-- =====================================
-- COMPANY_LOCATION
-- =====================================
INSERT INTO COMPANY_LOCATION VALUES
(1,1),(1,2),(1,11),(1,13),
(2,1),(2,5),(2,11),(2,9),
(3,3),(3,7),(3,15),
(4,2),(4,7),(4,10),(4,14),
(5,11),(5,12),(5,13),
(6,5),(6,6),(6,9),(6,10),
(7,11),(7,12),
(8,1),(8,3),(8,4),
(9,11),(9,19),(9,20),
(10,13),(10,14),(10,15),
(11,5),(11,6),
(12,7),(12,8),
(13,9),(13,10),
(14,15),(14,16),
(15,17),(15,18),
(16,19),(16,20),
(17,1),(17,11),
(18,2),(18,13),
(19,5),(19,15),
(20,3),(20,4);

-- =====================================
-- TOURIST (20)
-- =====================================
INSERT INTO TOURIST VALUES
(1,'John','Doe','john@mail.com','111','USA','A1001'),
(2,'Emma','Smith','emma@mail.com','222','UK','A1002'),
(3,'Noa','Levi','noa@mail.com','333','Israel','A1003'),
(4,'Luca','Rossi','luca@mail.com','444','Italy','A1004'),
(5,'Marie','Dubois','marie@mail.com','555','France','A1005'),
(6,'Carlos','Garcia','carlos@mail.com','666','Spain','A1006'),
(7,'David','Cohen','david@mail.com','777','Israel','A1007'),
(8,'Anna','Schmidt','anna@mail.com','888','Germany','A1008'),
(9,'Yuki','Tanaka','yuki@mail.com','999','Japan','A1009'),
(10,'Ali','Hassan','ali@mail.com','000','UAE','A1010'),
(11,'Daniel','Green','daniel@mail.com','101','USA','A1011'),
(12,'Sophie','Martin','sophie@mail.com','102','France','A1012'),
(13,'Eitan','Peretz','eitan@mail.com','103','Israel','A1013'),
(14,'Laura','Garcia','laura@mail.com','104','Spain','A1014'),
(15,'Tom','White','tomw@mail.com','105','UK','A1015'),
(16,'Hiro','Sato','hiro@mail.com','106','Japan','A1016'),
(17,'Omar','Ali','omar@mail.com','107','UAE','A1017'),
(18,'Nina','Klein','nina@mail.com','108','Germany','A1018'),
(19,'George','King','george@mail.com','109','UK','A1019'),
(20,'Yael','Mizrahi','yael@mail.com','110','Israel','A1020');

-- =====================================
-- CAR 
-- =====================================
INSERT INTO CAR VALUES
(1,'Toyota','Corolla',2022,'Sedan',5,'Auto',400,160,'Available','',1),
(2,'Hyundai','i20',2021,'Mini',5,'Auto',250,120,'Available','',1),
(3,'BMW','X3',2023,'SUV',5,'Auto',550,320,'Rented','Luxury',2),
(4,'Audi','A4',2022,'Sedan',5,'Auto',450,300,'Rented','Premium',2),
(5,'Ford','Focus',2020,'Sedan',5,'Manual',350,140,'Available','',3),
(6,'Volkswagen','Golf',2021,'Hatchback',5,'Auto',300,150,'Maintenance','',4),
(7,'Tesla','Model 3',2023,'Electric',5,'Auto',450,350,'Rented','Electric',5),
(8,'Chevrolet','Malibu',2021,'Sedan',5,'Auto',400,180,'Available','',6),
(9,'Kia','Sportage',2022,'SUV',5,'Auto',500,200,'Available','',7),
(10,'Nissan','Micra',2019,'Mini',5,'Manual',250,100,'Available','',8),
(11,'Mazda','CX-5',2022,'SUV',5,'Auto',500,220,'Available','',3),
(12,'Skoda','Octavia',2021,'Sedan',5,'Auto',420,160,'Available','',4),
(13,'Renault','Clio',2020,'Mini',5,'Manual',250,110,'Available','',6),
(14,'Peugeot','3008',2022,'SUV',5,'Auto',520,210,'Available','',6),
(15,'Jeep','Wrangler',2023,'SUV',5,'Auto',600,330,'Available','',7),
(16,'Fiat','500',2019,'Mini',4,'Manual',200,90,'Maintenance','',8),
(17,'Seat','Leon',2021,'Hatchback',5,'Auto',350,150,'Available','',9),
(18,'Volvo','XC60',2023,'SUV',5,'Auto',580,340,'Available','Luxury',10),
(19,'Honda','CRV',2022,'SUV',5,'Auto',550,230,'Available','',2),
(20,'Toyota','Yaris',2021,'Mini',5,'Auto',250,120,'Available','',1);

-- =====================================
-- BOOKING
-- =====================================
INSERT INTO BOOKING VALUES
(1,'2026-04-01','2026-04-05','2026-03-20',640,'Completed',1,1,11,11),
(2,'2026-04-02','2026-04-06','2026-03-25',480,'Completed',2,3,1,2),
(3,'2026-04-10','2026-04-15','2026-03-30',1600,'Active',3,2,5,9),
(4,'2026-04-12','2026-04-16','2026-04-01',1200,'Active',4,4,9,10),
(5,'2026-04-15','2026-04-18','2026-04-02',450,'Completed',5,6,15,16),
(6,'2026-04-20','2026-04-25','2026-04-05',750,'Completed',6,8,7,8),
(7,'2026-05-01','2026-05-10','2026-04-10',3150,'Active',7,1,11,12),
(8,'2026-05-03','2026-05-08','2026-04-12',900,'Completed',8,5,5,6),
(9,'2026-05-05','2026-05-09','2026-04-15',800,'Completed',9,10,19,20),
(10,'2026-05-07','2026-05-10','2026-04-18',300,'Completed',10,7,3,4),
(11,'2026-05-10','2026-05-14','2026-04-20',880,'Completed',11,11,7,8),
(12,'2026-05-12','2026-05-16','2026-04-22',640,'Completed',12,12,9,10),
(13,'2026-05-15','2026-05-18','2026-04-25',330,'Completed',13,13,1,3),
(14,'2026-05-18','2026-05-22','2026-04-27',840,'Completed',14,14,5,6),
(15,'2026-05-20','2026-05-25','2026-04-28',1650,'Completed',15,15,11,11),
(16,'2026-05-22','2026-05-24','2026-05-01',180,'Completed',16,16,17,18),
(17,'2026-05-25','2026-05-30','2026-05-02',750,'Completed',17,17,19,20),
(18,'2026-05-27','2026-06-01','2026-05-03',1700,'Completed',18,18,13,14),
(19,'2026-06-01','2026-06-06','2026-05-05',1150,'Completed',19,19,11,12),
(20,'2026-06-03','2026-06-07','2026-05-06',480,'Completed',20,20,2,1);

-- =====================================
-- REVIEW 
-- =====================================
INSERT INTO REVIEW VALUES
(1,5,'Excellent service','2026-04-06','Perfect',1),
(2,4,'Very good','2026-04-07','Nice',2),
(3,5,'Amazing car','2026-04-16','Great',3),
(4,4,'Comfortable','2026-04-17','Good',4),
(5,5,'Excellent trip','2026-04-19','Great',5),
(6,4,'Smooth ride','2026-04-26','Good',6),
(7,5,'Perfect experience','2026-05-11','Top',7),
(8,4,'Very nice','2026-05-09','Nice',8),
(9,5,'Loved it','2026-05-10','Great',9),
(10,3,'Okay','2026-05-11','Average',10),
(11,4,'Good car','2026-05-15','Nice',11),
(12,5,'Excellent','2026-05-17','Perfect',12),
(13,3,'Fine','2026-05-19','Ok',13),
(14,4,'Comfortable','2026-05-23','Good',14),
(15,5,'Amazing','2026-05-26','Top',15),
(16,4,'Nice','2026-05-25','Good',16),
(17,5,'Great service','2026-05-31','Excellent',17),
(18,5,'Luxury feel','2026-06-02','Top',18),
(19,4,'Good','2026-06-07','Nice',19),
(20,5,'Perfect','2026-06-08','Excellent',20);