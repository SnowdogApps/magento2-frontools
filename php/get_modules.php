<?php

require(__DIR__ . '/../../../../app/bootstrap.php');

$params = $_SERVER;
$params[\Magento\Store\Model\StoreManager::PARAM_RUN_CODE] = 'admin';
$params[\Magento\Store\Model\Store::CUSTOM_ENTRY_POINT_PARAM] = true;
$params['entryPoint'] = basename(__FILE__);

$objectManagerFactory = Magento\Framework\App\Bootstrap::createObjectManagerFactory(BP, $params);
$objectManager = $objectManagerFactory->create($params);

$componentRegistrar = $objectManager->create(
    'Magento\Framework\Component\ComponentRegistrar'
);

$modules = $componentRegistrar->getPaths('module');

echo json_encode($modules, JSON_PRETTY_PRINT);
