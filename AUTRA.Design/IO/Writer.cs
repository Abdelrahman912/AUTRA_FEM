﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace AUTRA.Design
{
   public static class Writer
    {
        public static void Write<T>(T data,string path)
        {
            var jsonToWrite = JsonConvert.SerializeObject(data, Formatting.Indented);
            using (var writer = new StreamWriter(path))
            {
                writer.Write(jsonToWrite);
            }
        }
       
    }
}
