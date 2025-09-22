# Script para criar 10 veiculos com autenticacao JWT
$API_BASE_URL = "https://backoffice-veiculos-api-production.up.railway.app"

Write-Host "Obtendo token de autenticacao..." -ForegroundColor Cyan

# Fazer login para obter token
try {
    $loginResponse = Invoke-WebRequest -Uri "$API_BASE_URL/api/users/login" -Method Post -Body '{"email":"admin@test.com","password":"password123"}' -ContentType "application/json"
    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginData.success) {
        $token = $loginData.data.token
        $userId = $loginData.data.user.id
        $userName = $loginData.data.user.name
        $userEmail = $loginData.data.user.email
        Write-Host "Token obtido com sucesso!" -ForegroundColor Green
        Write-Host "Usuario: $userName ($userEmail)" -ForegroundColor Green
    } else {
        Write-Host "Erro ao obter token: $($loginData.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Erro ao fazer login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Dados dos 10 veiculos para criar (formato da API real)
$vehicles = @(
    @{
        brand = "Toyota"
        vehicleModel = "Corolla"
        year = 2022
        price = 95000
        mileage = 15000
        fuelType = "gasoline"
        transmission = "automatic"
        color = "branco"
        doors = 4
        category = "car"
        condition = "used"
        description = "Toyota Corolla 2022, automatico, flex, unico dono, revisoes em dia."
        images = @("https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    },
    @{
        brand = "Honda"
        vehicleModel = "Civic"
        year = 2021
        price = 88000
        mileage = 25000
        fuelType = "gasoline"
        transmission = "automatic"
        color = "prata"
        doors = 4
        category = "car"
        condition = "used"
        description = "Honda Civic 2021, automatico, flex, bem conservado, ar condicionado digital."
        images = @("https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    },
    @{
        brand = "Volkswagen"
        vehicleModel = "Golf"
        year = 2020
        price = 75000
        mileage = 35000
        fuelType = "gasoline"
        transmission = "manual"
        color = "azul"
        doors = 4
        category = "car"
        condition = "used"
        description = "Volkswagen Golf 2020, manual, flex, teto solar, sistema de som premium."
        images = @("https://images.unsplash.com/photo-1549317336-206569e8475c?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    },
    @{
        brand = "Ford"
        vehicleModel = "Ranger"
        year = 2023
        price = 180000
        mileage = 8000
        fuelType = "diesel"
        transmission = "automatic"
        color = "preto"
        doors = 4
        category = "car"
        condition = "used"
        description = "Ford Ranger 2023, automatica, diesel, 4x4, cabine dupla, quase nova."
        images = @("https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    },
    @{
        brand = "Chevrolet"
        vehicleModel = "Onix"
        year = 2022
        price = 65000
        mileage = 20000
        fuelType = "gasoline"
        transmission = "manual"
        color = "vermelho"
        doors = 4
        category = "car"
        condition = "used"
        description = "Chevrolet Onix 2022, manual, flex, economico, ideal para cidade."
        images = @("https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    },
    @{
        brand = "Fiat"
        vehicleModel = "Argo"
        year = 2021
        price = 58000
        mileage = 30000
        fuelType = "gasoline"
        transmission = "manual"
        color = "branco"
        doors = 4
        category = "car"
        condition = "used"
        description = "Fiat Argo 2021, manual, flex, ar condicionado, direcao hidraulica."
        images = @("https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    },
    @{
        brand = "Hyundai"
        vehicleModel = "HB20"
        year = 2023
        price = 70000
        mileage = 5000
        fuelType = "gasoline"
        transmission = "automatic"
        color = "cinza"
        doors = 4
        category = "car"
        condition = "used"
        description = "Hyundai HB20 2023, automatico, flex, seminovo, garantia de fabrica."
        images = @("https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    },
    @{
        brand = "Nissan"
        vehicleModel = "Kicks"
        year = 2022
        price = 85000
        mileage = 18000
        fuelType = "gasoline"
        transmission = "automatic"
        color = "laranja"
        doors = 4
        category = "car"
        condition = "used"
        description = "Nissan Kicks 2022, automatico, flex, SUV compacto, tecnologia avancada."
        images = @("https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    },
    @{
        brand = "Renault"
        vehicleModel = "Duster"
        year = 2021
        price = 78000
        mileage = 28000
        fuelType = "gasoline"
        transmission = "manual"
        color = "verde"
        doors = 4
        category = "car"
        condition = "used"
        description = "Renault Duster 2021, manual, flex, 4x4, ideal para aventuras."
        images = @("https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    },
    @{
        brand = "Peugeot"
        vehicleModel = "208"
        year = 2023
        price = 72000
        mileage = 3000
        fuelType = "gasoline"
        transmission = "automatic"
        color = "preto"
        doors = 4
        category = "car"
        condition = "used"
        description = "Peugeot 208 2023, automatico, flex, design moderno, tecnologia francesa."
        images = @("https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800")
        location = @{
            city = "Sao Paulo"
            state = "SP"
            zipCode = "01310-100"
        }
        seller = @{
            id = $userId
            name = $userName
            phone = "(11) 99999-9999"
            email = $userEmail
        }
        isFeatured = $false
    }
)

# Funcao para criar um veiculo
function Create-Vehicle {
    param($vehicleData)
    
    try {
        $json = $vehicleData | ConvertTo-Json -Depth 3
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-WebRequest -Uri "$API_BASE_URL/api/vehicles" -Method Post -Body $json -Headers $headers -TimeoutSec 10
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            Write-Host "Veiculo criado: $($vehicleData.brand) $($vehicleData.vehicleModel) - R$ $($vehicleData.price.ToString('N0'))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "Erro HTTP $($response.StatusCode) ao criar $($vehicleData.brand) $($vehicleData.vehicleModel)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "Erro ao criar veiculo $($vehicleData.brand) $($vehicleData.vehicleModel): $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $errorResponse = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorResponse)
            $errorContent = $reader.ReadToEnd()
            Write-Host "   Detalhes: $errorContent" -ForegroundColor Yellow
        }
        return $false
    }
}

# Funcao principal
Write-Host ""
Write-Host "Iniciando criacao de 10 veiculos com autenticacao JWT..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$errorCount = 0

for ($i = 0; $i -lt $vehicles.Count; $i++) {
    $vehicle = $vehicles[$i]
    Write-Host "[$($i + 1)/10] Criando $($vehicle.brand) $($vehicle.vehicleModel)..." -ForegroundColor Yellow
    
    $result = Create-Vehicle -vehicleData $vehicle
    
    if ($result) {
        $successCount++
    } else {
        $errorCount++
    }
    
    # Pequena pausa entre as requisicoes
    Start-Sleep -Milliseconds 1000
}

Write-Host ""
Write-Host "Resumo Final:" -ForegroundColor Cyan
Write-Host "Sucessos: $successCount" -ForegroundColor Green
Write-Host "Erros: $errorCount" -ForegroundColor Red
Write-Host "Total: $($vehicles.Count)" -ForegroundColor Blue

if ($successCount -gt 0) {
    Write-Host ""
    Write-Host "Veiculos criados com sucesso!" -ForegroundColor Green
    Write-Host "Acesse: https://backoffice-veiculos-web-production.up.railway.app/veiculos" -ForegroundColor Cyan
    Write-Host "para visualizar os veiculos criados." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Nenhum veiculo foi criado. Verifique os erros acima." -ForegroundColor Yellow
}
