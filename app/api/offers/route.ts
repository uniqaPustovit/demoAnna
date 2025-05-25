import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const { product, insuranceAmount } = await request.json();
    // console.log(insuranceAmount);
    let offersData = {
      "ProductId": "ANNA",
      "InputParameters": [
          
          {
              "Ecode": "TDOG",
              "Code": "INSURED_DEVICES",
              "Value": product,
              "Text": ""
          },
          {
              "Ecode": "TDOG",
              "Code": "SUM_INSURED_MAX",
              "Value": insuranceAmount,
              "Text": ""
          }
      ],
      "GeneratePrintForm": false
  }
  

    if (!product || !insuranceAmount) {
      return NextResponse.json(
        { error: 'Product and insurance amount are required' },
        { status: 400 }
      );
    }


    const getToken = async () => {
      try {
        
          const tokenUrl = process.env.NEXT_PUBLIC_TEST_ISTUDIO_TOKEN_URL;
          
          if (!tokenUrl) {
              throw new Error("Token URL is not configured");
          }
          const response = await fetch(
              tokenUrl,
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                      grant_type: "password",
                      username: process.env.NEXT_PUBLIC_ISTUDIO_USERNAME_TEST || '',
                      password: process.env.NEXT_PUBLIC_ISTUDIO_PASSWORD_TEST || '',
                  }),
              }
          )
          // console.log(response)
          if (!response.ok) {
              throw new Error("Network response was not ok")
          }

          const data = await response.json()
          // console.log(data)
          return data.access_token
      } catch (error) {
          console.error(
              { error: "TOKEN:Failed to fetch token" },
              { status: 500 }
          )
          return error.message
      }
  }

  const offers = async (data: any) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Failed to fetch token1");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TEST_ISTUDIO_API_URL}/offerCalc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(data)
        }
      )
      // console.log(response.json())
      const data11 = await response.json()
      console.log(data11);
      const data22 = {
        "CompositeOfferItems": [
            {
                "OfferItems": [
                    {
                        "Pcode": "MN_ADRES2106",
                        "PcodeName": "Населений пункт розташування майна",
                        "Code": "01",
                        "Value": "Київ та Київська область"
                    },
                    {
                        "Pcode": "MN_RISK2106_1",
                        "PcodeName": "Витрати на клінінг за ризиками Вогню",
                        "Code": "01",
                        "Value": "Покривається"
                    },
                    {
                        "Pcode": "MN_RISK2106_2",
                        "PcodeName": "Витрати на відновлення документів",
                        "Code": "01",
                        "Value": "Покривається"
                    },
                    {
                        "Pcode": "MN_RISK2106_3",
                        "PcodeName": "Витрати на заміну дверних замків / ключів",
                        "Code": "01",
                        "Value": "Покривається"
                    },
                    {
                        "Pcode": "MN_FR2106N",
                        "PcodeName": "Франшиза, грн",
                        "Code": "01",
                        "Value": "3000"
                    },
                    {
                        "Pcode": "MN_LIM2106",
                        "PcodeName": "Ліміт відповідальності, грн",
                        "Code": "01",
                        "Value": "100000"
                    },
                    {
                        "Pcode": "MN_RM2106",
                        "PcodeName": "Рухоме майно",
                        "Code": "01",
                        "Value": "Покривається"
                    }
                ],
                "CalcItems": [
                    {
                        "Code": "K34",
                        "Name": "Строк дії (діапазон)",
                        "Value": "4-15 днів"
                    },
                    {
                        "Code": "SPDP1",
                        "Name": "Загальний cтраховий платіж без знижок, грн",
                        "Value": "286"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "K6",
                        "Name": "К6 - Ліміт по пошкодженню водою Майно",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "K7",
                        "Name": "К7 - Рухоме майно",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "K5",
                        "Name": "K5 - Період дії договору",
                        "Value": ",75"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "2",
                        "Name": "Загальний страховий платіж, грн",
                        "Value": "286"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "1",
                        "Name": "Страхова сума  (майно), грн ",
                        "Value": "100000"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "SS1",
                        "Name": "Страхова сума (цв), грн",
                        "Value": "0"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "K1",
                        "Name": "K1 - Комісійна винагорода",
                        "Value": ",82"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "K2",
                        "Name": "K2 - Франшиза",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "K3",
                        "Name": "K3 - Бонус-Малус",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "K4",
                        "Name": "K4 - Розбивка платежу",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "SSD1",
                        "Name": "Субліміт по Воєнним ризикам, грн",
                        "Value": "0"
                    }
                ]
            },
            {
                "OfferItems": [
                    {
                        "Pcode": "MN_ADRES2106",
                        "PcodeName": "Населений пункт розташування майна",
                        "Code": "01",
                        "Value": "Київ та Київська область"
                    },
                    {
                        "Pcode": "MN_RISK2106_1",
                        "PcodeName": "Витрати на клінінг за ризиками Вогню",
                        "Code": "01",
                        "Value": "Покривається"
                    },
                    {
                        "Pcode": "MN_RISK2106_2",
                        "PcodeName": "Витрати на відновлення документів",
                        "Code": "01",
                        "Value": "Покривається"
                    },
                    {
                        "Pcode": "MN_RISK2106_3",
                        "PcodeName": "Витрати на заміну дверних замків / ключів",
                        "Code": "01",
                        "Value": "Покривається"
                    },
                    {
                        "Pcode": "MN_FR2106N",
                        "PcodeName": "Франшиза, грн",
                        "Code": "01",
                        "Value": "3000"
                    },
                    {
                        "Pcode": "MN_LIM2106",
                        "PcodeName": "Ліміт відповідальності, грн",
                        "Code": "01",
                        "Value": "100000"
                    },
                    {
                        "Pcode": "MN_RM2106",
                        "PcodeName": "Рухоме майно",
                        "Code": "02",
                        "Value": "Не покривається"
                    }
                ],
                "CalcItems": [
                    {
                        "Code": "K34",
                        "Name": "Строк дії (діапазон)",
                        "Value": "4-15 днів"
                    },
                    {
                        "Code": "SPDP1",
                        "Name": "Загальний cтраховий платіж без знижок, грн",
                        "Value": "286"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "K6",
                        "Name": "К6 - Ліміт по пошкодженню водою Майно",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "K7",
                        "Name": "К7 - Рухоме майно",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "K5",
                        "Name": "K5 - Період дії договору",
                        "Value": ",75"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "2",
                        "Name": "Загальний страховий платіж, грн",
                        "Value": "286"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "1",
                        "Name": "Страхова сума  (майно), грн ",
                        "Value": "100000"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "SS1",
                        "Name": "Страхова сума (цв), грн",
                        "Value": "0"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "K1",
                        "Name": "K1 - Комісійна винагорода",
                        "Value": ",82"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "K2",
                        "Name": "K2 - Франшиза",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TOBJ",
                        "Code": "K3",
                        "Name": "K3 - Бонус-Малус",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "K4",
                        "Name": "K4 - Розбивка платежу",
                        "Value": "1"
                    },
                    {
                        "Ecode": "TDOG",
                        "Code": "SSD1",
                        "Name": "Субліміт по Воєнним ризикам, грн",
                        "Value": "0"
                    }
                ]
            }
        ]
      }
      return data11
      
    } catch (error) {
      console.error('Error fetching offers:', error);
      return NextResponse.json({ error: error.message }, { status: 500 })
  }}

  const offersResult = await offers(offersData)
    return NextResponse.json(offersResult, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 