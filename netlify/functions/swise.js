exports.handler = async function(event, context) {
  // السماح بطلبات CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    // طباعة الطلب في السجلات للتحقق منه
    console.log("📥 طلب جديد تم استلامه:", JSON.stringify(data, null, 2));

    // استدعاء Swise Center API
    const apiKey = process.env.SWISE_API_KEY;
    
    // إذا كان هناك API خاص بـ Swise يتم توجيه الطلب إليه هنا
    if (apiKey) {
      try {
        const response = await fetch('https://swise.center/api/v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: apiKey,
            action: 'add',
            service: data.service,
            link: data.target,
            quantity: data.package ? data.package.count : 1
          })
        });

        const resData = await response.json();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, swiseResponse: resData, order: data })
        };
      } catch (apiErr) {
        console.error("⚠️ خطأ الاتصال بـ Swise API:", apiErr.message);
      }
    }

    // إرجاع استجابة نجاح حتى في حالة المعالجة اليدوية / SMS Forwarder
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: "تم تسجيل الطلب بنجاح وهو قيد التحقق من التحويل", 
        order: data 
      })
    };

  } catch (error) {
    console.error("❌ Error in swise function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "حدث خطأ أثناء معالجة الطلب: " + error.message })
    };
  }
};
