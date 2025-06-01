-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 31-Maio-2025 às 23:36
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `restaurante`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `assessment`
--

CREATE TABLE `assessment` (
  `id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `stars` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `assessment`
--

INSERT INTO `assessment` (`id`, `table_id`, `stars`, `comment`, `created_at`) VALUES
(1, 1, 5, 'Amei a forma de atendimento, muito inovador', '2025-05-31 20:35:06'),
(2, 1, 5, 'Metodo original', '2025-05-31 21:05:19');

-- --------------------------------------------------------

--
-- Estrutura da tabela `calls`
--

CREATE TABLE `calls` (
  `id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` enum('pendente','atendido','cancelado') DEFAULT 'pendente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Todas'),
(2, 'Lanches'),
(3, 'Massas'),
(4, 'Pratos Principais'),
(5, 'Entradas'),
(6, 'Sobremesas'),
(7, 'Bebidas');

-- --------------------------------------------------------

--
-- Estrutura da tabela `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `table_number` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `clients`
--

INSERT INTO `clients` (`id`, `name`, `table_number`, `created_at`) VALUES
(4, 'João', 1, '2025-05-31 21:56:19'),
(5, 'Ana', 1, '2025-05-31 21:56:19');

-- --------------------------------------------------------

--
-- Estrutura da tabela `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `mesa` varchar(10) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `produtos` text DEFAULT NULL,
  `quantidade` text DEFAULT NULL,
  `cliente` varchar(100) DEFAULT NULL,
  `garcon` varchar(100) DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `preco_total` decimal(10,2) DEFAULT NULL,
  `data` datetime DEFAULT current_timestamp(),
  `order_nome` varchar(100) DEFAULT NULL,
  `garcom_id` int(11) DEFAULT NULL,
  `garcom_nome` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `history`
--

INSERT INTO `history` (`id`, `mesa`, `order_id`, `produtos`, `quantidade`, `cliente`, `garcon`, `preco`, `preco_total`, `data`, `order_nome`, `garcom_id`, `garcom_nome`) VALUES
(1, '1', 1, 'Pão com Chouriço', '3', 'Pedro', NULL, 15.00, 98.00, '2025-05-31 20:43:30', '1', 1, NULL),
(2, '1', 1, 'Massa com Muamba de Galinha', '1', 'Pedro', NULL, 35.00, 98.00, '2025-05-31 20:43:30', '1', 1, NULL),
(3, '1', 1, 'Ginga com Cuscuz', '1', 'Pedro', NULL, 18.00, 98.00, '2025-05-31 20:43:30', '1', 1, NULL),
(4, '1', 2, 'Calulu de Peixe', '1', 'Paulo', NULL, 40.00, 40.00, '2025-05-31 21:05:50', '2', 1, NULL),
(5, '1', 2, 'Funge com Molho de Feijão', '1', 'Guilherme', NULL, 20.00, 20.00, '2025-05-31 21:05:50', '2', 1, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `read_status` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `table_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT 0.00,
  `status` enum('pendente','em preparo','pronto','entregue') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('cash','credit','debit','pix') DEFAULT 'cash',
  `paid_at` datetime DEFAULT current_timestamp(),
  `comprovativo_arquivo` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `order_nome` varchar(100) DEFAULT NULL,
  `garcom_id` int(11) DEFAULT NULL,
  `garcom_nome` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `method`, `paid_at`, `comprovativo_arquivo`, `transaction_id`, `order_nome`, `garcom_id`, `garcom_nome`) VALUES
(1, 1, 98.00, '', '2025-05-31 20:42:21', NULL, '54342644', '1', 1, NULL),
(2, 1, 98.00, '', '2025-05-31 20:43:30', NULL, '7654326546', '1', 1, NULL),
(3, 2, 60.00, 'cash', '2025-05-31 21:05:50', NULL, NULL, '2', 1, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `category_id`, `image_url`, `available`) VALUES
(1, 'Pão com Chouriço', 'Pão caseiro recheado com chouriço artesanal angolano', 15.00, 2, 'https://images.unsplash.com/photo-1605478571951-417b2c1b1f05', 1),
(2, 'Pastel de Carne', 'Pastel frito recheado com carne moída temperada', 12.00, 2, 'https://images.unsplash.com/photo-1611078489935-5e6e053f9021', 0),
(3, 'Massa com Muamba de Galinha', 'Massa penne acompanhada de muamba tradicional de galinha', 35.00, 3, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 1),
(4, 'Macarrão com Calulu', 'Massa ao molho leve servida com calulu de peixe seco', 30.00, 3, 'https://images.unsplash.com/photo-1589307004394-04c9be504b07', 0),
(5, 'Calulu de Peixe', 'Prato tradicional com peixe seco, quiabo e óleo de palma', 40.00, 4, 'https://images.unsplash.com/photo-1631515243343-bd6f26b90286', 1),
(6, 'Muamba de Galinha', 'Galinha cozida com quiabo e molho de dendê', 42.00, 4, 'https://images.unsplash.com/photo-1625941118446-6f0b0bb1ec2d', 0),
(7, 'Ginga com Cuscuz', 'Pequenos peixes fritos servidos com cuscuz de milho', 18.00, 5, 'https://images.unsplash.com/photo-1585076804023-716ec1d840ec', 1),
(8, 'Funge com Molho de Feijão', 'Porção de funge servida com molho de feijão encorpado', 20.00, 5, 'https://images.unsplash.com/photo-1646825464745-cb62b4db5ef4', 1),
(9, 'Cocada Amarela', 'Doce típico feito com coco, gemas e açúcar', 16.00, 6, 'https://images.unsplash.com/photo-1576789442531-fad8e8a8dcb0', 0),
(10, 'Doce de Ginguba', 'Pasta doce feita com amendoim caramelizado', 14.00, 6, 'https://images.unsplash.com/photo-1632492098419-5d2c3bb31bb4', 1),
(11, 'Kissangua', 'Bebida fermentada de milho, típica das festas angolanas', 10.00, 7, 'https://images.unsplash.com/photo-1574267432518-46a7c3a2f9b4', 1),
(12, 'Cuca (Cerveja Nacional)', 'Cerveja tradicional angolana, bem gelada', 12.00, 7, 'https://images.unsplash.com/photo-1514361892635-e48e52b5799c', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `status_log`
--

CREATE TABLE `status_log` (
  `id` int(11) NOT NULL,
  `table_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `previous_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) DEFAULT NULL,
  `changed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tables`
--

CREATE TABLE `tables` (
  `id` int(11) NOT NULL,
  `table_number` int(11) NOT NULL,
  `people_count` int(11) NOT NULL,
  `status` enum('livre','ocupado','reservado','usado') DEFAULT 'livre'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `tables`
--

INSERT INTO `tables` (`id`, `table_number`, `people_count`, `status`) VALUES
(1, 1, 2, ''),
(2, 2, 0, 'livre'),
(3, 3, 0, 'livre'),
(4, 4, 0, 'livre'),
(5, 5, 0, 'livre'),
(6, 6, 0, 'livre'),
(7, 7, 0, 'livre'),
(8, 8, 0, 'livre'),
(9, 9, 0, 'ocupado'),
(10, 10, 0, 'ocupado');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','chef','garcon') DEFAULT 'chef',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'João Garçom', 'joao.garcom@restaurante.com', 'senha123', 'garcon', '2025-05-31 20:33:31');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `assessment`
--
ALTER TABLE `assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_assessment_table_number` (`table_id`);

--
-- Índices para tabela `calls`
--
ALTER TABLE `calls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_call_table_number` (`table_id`);

--
-- Índices para tabela `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_history_mesa` (`mesa`),
  ADD KEY `fk_history_order` (`order_id`),
  ADD KEY `fk_history_garcon` (`garcon`);

--
-- Índices para tabela `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Índices para tabela `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_table_number` (`table_id`);

--
-- Índices para tabela `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Índices para tabela `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payments_order` (`order_id`);

--
-- Índices para tabela `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Índices para tabela `status_log`
--
ALTER TABLE `status_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `table_id` (`table_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Índices para tabela `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `table_number` (`table_number`),
  ADD UNIQUE KEY `table_number_2` (`table_number`);

--
-- Índices para tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `assessment`
--
ALTER TABLE `assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `calls`
--
ALTER TABLE `calls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `status_log`
--
ALTER TABLE `status_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `assessment`
--
ALTER TABLE `assessment`
  ADD CONSTRAINT `fk_assessment_table_number` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_number`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `calls`
--
ALTER TABLE `calls`
  ADD CONSTRAINT `fk_call_table_number` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_number`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Limitadores para a tabela `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_table_number` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_number`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Limitadores para a tabela `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Limitadores para a tabela `status_log`
--
ALTER TABLE `status_log`
  ADD CONSTRAINT `status_log_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`),
  ADD CONSTRAINT `status_log_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
