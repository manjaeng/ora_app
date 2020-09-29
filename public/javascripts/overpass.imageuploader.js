(function ($) {
	OVERPASS.UPLOADER.JS.create = function(pin) {
		var imagesRow = {};
		var container = $("#" + pin.div_id).addClass("img_wrap");
		var type = pin.properties.type;
		var min_width = pin.properties.min_width;
		var min_height = pin.properties.min_height;
		
		var checkImageFile = function(file, callback) {	//파일에 대해서 유효성 확인 후 thumnail 생성
			var reader = new FileReader();
			var file_name = file.name;
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				var result = e.srcElement.result;
				var image = new Image();
				image.src = result;
				image.onload = function() {
					var pixel_width = this.width;
					var pixel_height = this.height;
					var width = 144;
					var height = 144;
					var canvas = document.createElement("canvas");
					var canvasContext = canvas.getContext("2d");
					
					if (min_width > 0 && pixel_width < min_width) {
						alert("원본이미지[" + file_name + "]의 폭이 최소 폭 보다 작습니다(최소폭: " + min_width + ", 실제: " + pixel_width + ")");
						return false;
					} else if (min_height > 0 && pixel_height < min_height) {
						alert("원본이미지[" + file_name + "]의 높이가 최소 높이 보다 작습니다(최소높이: " + min_height + ", 실제: " + pixel_height + ")");
						return false;
					};
					
					//캔버스 크기 설정
		            canvas.width = 144;
		            canvas.height = 144;
					
					canvasContext.fillStyle = "#ffffff";
					canvasContext.fillRect(0, 0, width, height);
					canvasContext.mozImageSmoothingEnabled = false;
					
					if (pixel_width > pixel_height) {
						height = pixel_height * 144 / pixel_width;								
					} else if (pixel_width < pixel_height) {
						width = pixel_width * 144 / pixel_height;
					};
		            //이미지를 캔버스에 그리기
		            canvasContext.drawImage(this, (144 - width) / 2, (144 - height) / 2, width, height);
		            callback({
		            	pixel_width: pixel_width,
		            	pixel_height: pixel_height,
		            	thumbnail: canvas.toDataURL("image/jpeg")
		            });
				};						
			};
		};
		
		//레이아웃		
		var AddImages = function(p) {
			var opt_val_nm = p.opt_val_nm;
			var chip_exsists = false;
			var row = (function() {	//row 단위
				var div = $("<div/>").addClass("unit");
				if (type == "B") {
					div.addClass("item");
				};
				return div;
			})();
			var addImage = function(image) {
				var role = type == "B" && image.chip_yn == "Y" ? "chip" : "image";
				var pannel = (function() {
					if (role == "chip") {
						return $("<div/>").addClass("itm");
					} else {
						return $("<li/>").attr({ role: role }); 
					};
				})();
				var img_divi_cd_select = (function() {
					var span = $("<span/>").addClass("sel");
					var select = $("<select></select>");
					var img_divi_cd = image.img_divi_cd || "";
					select.append("<option value=''>=선택=</option>");
					$.each(pin.properties.img_divi_cd_combo, function(i, combo) {
						select.append($("<option value=\"" + combo.key + "\"></option>").append(combo.value));				
					});
					if (select.find("option[value='" + img_divi_cd + "']").length == 1) {
						select.val(img_divi_cd);
					};
					return span.append(select);
				})();
				var color_no_select = (function() {
					var select = $("<select></select>");
					var color_no  = image.color_no || "";
					select.append("<option value=''>=선택=</option>");
					$.each(pin.properties.color_no_combo, function(i, combo) {
						select.append($("<option value=\"" + combo.key + "\"></option>").append(combo.value));
					});
					if (select.find("option[value='" + color_no + "']").length == 1) {
						select.val(color_no);
					};
					if (pin.properties.color_no_combo.length == 0) {
						select.hide();
					};
					return select;
				})();
				var image_data = {
					crud: image.crud || "R",
					chip_yn: image.chip_yn || "N",
					img_divi_cd: image.img_divi_cd || "",	//최초 셋팅값
					color_no: image.color_no || "",	//최초 셋팅값
					img_url: image.img_url || "",
					file: image.file || null,
					thumbnail: image.thumbnail || null,
					no_chip: image.no_chip || false,
					disp_seq: image.disp_seq || 0,
					goods_no: image.goods_no || "",
					img_seq: image.img_seq || "",
					opt_val_nm: opt_val_nm,
					upper_item_no: image.upper_item_no || "",
					width: image.width || 0,
					height: image.height || 0,
					pixel_width: image.pixel_width || 0,
					pixel_height: image.pixel_height || 0,					
					getWidth: function() {
						if (this.getCRUD() != "D" && this.pixel_width > 0) {
							return this.pixel_width;
						} else {
							return this.width;
						};
					},
					getHeight: function() {
						if (this.getCRUD() != "D" && this.pixel_height > 0) {
							return this.pixel_height;
						} else {
							return this.height;
						};
					},
					getImgDiviCd: function() {
						var select = img_divi_cd_select.find("select");
						if (role == "chip") {		//이 경우 콤보값이 아닌 자체값 리턴
							return this.img_divi_cd;
						} else {
							return select.val();
						};
					},
					getColorNo: function() {
						if (role == "chip") {		//이 경우 콤보값이 아닌 자체값 리턴
							return this.color_no;
						} else {
							return color_no_select.val() != null ? color_no_select.val() : "" ;
						};
					},
					getDispSeq: function() {
						if (role == "chip") {
							return 0;
						} else {
							return pannel.index() + 1;		//0부터 시작 하니 1 더해주기	
						};
					},
					getCRUD: function() {
						var crud = this.crud;
						if (crud == "R" &&  (this.file != null || this.disp_seq != this.getDispSeq() || this.img_divi_cd != this.getImgDiviCd() || this.color_no != this.getColorNo())) {
							crud = "U";
						};
						return crud;
					},
					setData: function(p) {
						if (p.img_divi_cd) {
							img_divi_cd_select.find("select").val(p.img_divi_cd);
						};
						if (p.color_no) {
							color_no_select.val(p.color_no);
						};						
					},
					changeColorNo: function(img_divi_cd_combo) {
						color_no_select.empty();
						color_no_select.append("<option value=''>=선택=</option>");
						$.each(img_divi_cd_combo, function(i, combo) {
							color_no_select.append($("<option value=\"" + combo.key + "\"></option>").append(combo.value));							
						});
					}					
				};				
				var img = (function() {
					var img = $("<img/>").error(function() {
						this.src = "/images/uploader/img_no.jpg";
					}).prop({ 
						width: "144", height: "144", 
						src: (function() {
							if (image_data.file != null && image_data.thumbnail != null) {
								return image_data.thumbnail;
							} else {
								return image_data.img_url;
							};
						})()  
					});
					if (role == "image") {
						img.draggable({
							helper: function() {							
								return $("<img width='144px' height='144px' />").prop({ src: img.prop("src") }).css({ "z-index": 9999 });
							},
							containment: pannels,
							opacity: 0.7
						}).droppable({
							drop: function(e, u) {
								var draggable = u.draggable.parent().parent();	//drag 이미지
								var droppable = $(e.target).parent().parent();	//drop 대상
								if (draggable.index() < droppable.index()) {
									droppable.after(draggable);
								} else {
									droppable.before(draggable);
								};								
							}
						});
					};
					return img;
				})();
				var opt_val_nm_text = $("<span></span>").text(opt_val_nm).addClass("txt").hide();
				var browse_button = $("<span/>").addClass("sch").append($("<button type='button'>검색</button>").click(function(e) {
					$("<input accept='image/*' />").prop({ type: "file" }).change(function(e) {
						$.each(this.files, function(i, file) {
							checkImageFile(file, function(result) {
								console.dir(result);
								img.prop({ src: result.thumbnail });
								image_data.file = file;
								image_data.pixel_width = result.pixel_width;
								image_data.pixel_height = result.pixel_height;
							});
						});						
						return false;
					}).trigger("click");
				}));
				var delete_button = $("<span/>").addClass("del").append($("<button type='button'>삭제</button>")).click(function() {
					var index = imagesRow[opt_val_nm].images.indexOf(image_data);
					pannel.remove();
					if (image_data.crud == "C") {
						delete imagesRow[opt_val_nm].images[index];
					};
					image_data.crud = "D";
					if (role == "chip") {		//칩의경우 Delete하고 Create 한다(실제 이미지 파일 업로드시만 서버로 전송)
						addImage({
							crud: "C",
							chip_yn: "Y",
							img_divi_cd: image_data.img_divi_cd,
							color_no: image_data.color_no
						});
					};					
				});
				var tp = $("<div/>").addClass("tp").append(opt_val_nm_text).append(img_divi_cd_select).append("\n").append(browse_button).append("\n").append(delete_button).appendTo(pannel);
				var md = $("<div/>").addClass("md").append(img).appendTo(pannel);
				var bt = $("<div/>").addClass("bt").append(color_no_select).appendTo(pannel);
				if (type == "B") {
					color_no_select.hide();
				};
				if (role == "chip") {	//칩 pannel
					img_divi_cd_select.hide();
					opt_val_nm_text.show();
					pannels.before(pannel);
					//opt_val_nm만 노출할 경우
					if (image_data.no_chip === true) {
						opt_val_nm_text.css({ "text-align": "center" });
						browse_button.hide();
						delete_button.hide();
						img.hide();						
					};
				} else {
					pannels.find("li[role='add']").before(pannel);
				};
				if (image_data.no_chip !== true) {
					imagesRow[opt_val_nm].images.push(image_data);					
				};
				pin.events.ImageAdded({
					opt_val_nm: opt_val_nm,					
					col: imagesRow[opt_val_nm].images.indexOf(image_data),
					crud: image_data.getCRUD(),
					goods_no: image_data.goods_no,
					chip_yn: image_data.chip_yn,
					upper_item_no: image_data.upper_item_no,
					img_seq: image_data.img_seq,
					img_divi_cd: image_data.img_divi_cd,
					color_no: image_data.color_no,
					file_name: image_data.file != null ? image_data.file.name : "" 
				});
			};
			var pannels = $("<ul/>").addClass("lst").appendTo(row).append($("<li/>").attr({ role: "add" }).append($("<div/>").addClass("add").append($("<a href='#' onclick='javascript:return false;' />").click(function() {	//이미지 추가 버튼 클릭
				$("<input accept='image/*' />").prop({ type: "file", multiple: "multiple" }).change(function() {
					$.each(this.files, function(i, file) {
						checkImageFile(file, function(result) {
							addImage({
								crud: "C",
								file: file,
								thumbnail: result.thumbnail,
								pixel_width: result.pixel_width,
								pixel_height: result.pixel_height
							});
						});
					});
				}).trigger("click");
			}).append($("<img src='/images/uploader/img_add.jpg' width='144' height='144' alt='이미지추가'  />")))));	//이미지 리스트 영역
			
			if (imagesRow[opt_val_nm] != undefined) {
				alert("opt_val_nm [" + opt_val_nm + "] 속성은 이미 추가되어 있습니다.");
				return false;
			};
			
			imagesRow[opt_val_nm] = { images: [] };
			
			$.each(p.images, function(i, image) {
				if (image.chip_yn == "Y") {
					chip_exsists = true;
				};
				addImage(image);
			});
			if (type == "B" && chip_exsists === false) {		//B타입인데 chip이 없음
				addImage({ crud: "R", chip_yn: "Y", no_chip: true });
			};
			container.append(row);
		};
		
		var DoSave = function(p) {
			var formData = new FormData();
			var imageData = {};
			var row_id = 0;
			formData.append("_AJAX_", "Y");
			formData.append("_HEADER_MESSAGE_", "Y");
			$.each(p.params, function(name, value) {
				formData.append(name, value);	
			});
			$.each(imagesRow, function(opt_val_nm, row) {
				var images = row.images;
				row_id++;
				imageData[opt_val_nm] = [];				
				$.each(images, function(i, image) {
					var crud = image != undefined ? image.getCRUD() : "" ;
					var file_id = "";
					if (image == undefined || (crud == "C" && image.file == null)) {		//Create하고 Delete 했거나 이미지가 선택되지 않은 이미지는 서버로 전송하지 않는다.
						return true;
					};					
					if (crud != "D" && image.file != null) {
						file_id = "_UPLOAD_FILE_" + row_id + "_" + i;
						formData.append(file_id, image.file);					
					};
					imageData[opt_val_nm].push({
						chip_yn: image.chip_yn,
						goods_no: image.goods_no,
						img_seq: image.img_seq,
						img_divi_cd: image.getImgDiviCd(),
						color_no: image.getColorNo(),
						upper_item_no: image.upper_item_no,
						disp_seq: image.getDispSeq() + "",	
						cud: crud,					
						width: image.getWidth() + "",
						height: image.getHeight() + "",
						file_id: file_id
					});
				});				
			});
			formData.append("OPT_VALS", JSON.stringify(imageData));
			$.ajax({
				url: p.action,
				type: "post",
				dataType: "text",
				data: formData,
				processData: false,
				contentType: false,
				error: function() {},
				complete: function(jqXHR, textStatus) {										
					var p  = $.parseJSON(decodeURIComponent(jqXHR.getResponseHeader("_MESSAGES_").replace(/\+/g, '%20')));
					if (p.code == "S'" || p.error_type != "kr.co.overpass.frm.exception.AuthorityException") {
						pin.events.EndSave(p);	
					};
				}
			});
		};
		
		var GetImages = function() {
			var imagesData = [];
			$.each(imagesRow, function(opt_val_nm, row) {				
				imagesData.push({
					opt_val_nm: opt_val_nm,
					images_data: (function() {
						var images = [];
						$.each(row.images, function(i, image) {
							if (image == undefined) {
								return true;
							};
							images.push({
								col: i,
								crud: image.getCRUD(),
								goods_no: image.goods_no,
								chip_yn: image.chip_yn,
								upper_item_no: image.upper_item_no,
								img_seq: image.img_seq,
								img_divi_cd: image.getImgDiviCd(),
								color_no: image.getColorNo(),
								file_name: image.file != null ? image.file.name : ""
							});
						});
						return images;
					})()
				});
			});
			return imagesData;
		};
		
		var SetImage = function(p) {
			var col = p.col;
			var opt_val_nm = p.opt_val_nm;			
			imagesRow[opt_val_nm].images[col].setData(p);
		};
		var ChangeColorCombo = function(p) {
			$.each(imagesRow, function(opt_val_nm, row) {
				$.each(row.images, function(i, image) {
					image.changeColorNo(p.color_no_combo);
				});
			});
		};
		var Clear = function() {			
			container.empty();
			imagesRow = {};
		};
		$.extend(pin.functions, {
			AddImages: function(p) {                    		
				AddImages(p);
        	},
			DoSave: function(p) {
				DoSave(p);                  		
        	},
        	Clear: function(p) {
        		Clear();
        	},
        	GetImages: function(p) {
        		return GetImages();
        	},
        	ChangeColorCombo: function(p) {
        		ChangeColorCombo(p);
        	},
        	SetImage: function(p) {
        		SetImage(p);
        	}
    	});
	};
})(jQuery);